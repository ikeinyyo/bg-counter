import { expect, test, type Page } from "@playwright/test";

const resetApp = async (page: Page, path = "/") => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.goto(path);
};

const installWakeLockMock = async (page: Page) => {
  await page.addInitScript(() => {
    const state = { requests: 0, releases: 0 };
    Object.defineProperty(window, "__wakeLockState", { value: state });
    Object.defineProperty(navigator, "wakeLock", {
      configurable: true,
      value: {
        request: async () => {
          state.requests += 1;
          const sentinel = new EventTarget() as EventTarget & {
            released: boolean;
            release: () => Promise<void>;
          };
          sentinel.released = false;
          sentinel.release = async () => {
            if (sentinel.released) return;
            sentinel.released = true;
            state.releases += 1;
            sentinel.dispatchEvent(new Event("release"));
          };
          return sentinel;
        },
      },
    });
  });
};

const openMenuOnMobile = async (page: Page, projectName: string) => {
  if (projectName.includes("mobile")) {
    await page.getByRole("button", { name: "Opciones de la herramienta" }).click();
  }
};

const openOptionsMenu = async (page: Page) => {
  await page.getByRole("button", { name: "Opciones de la herramienta" }).click();
};

test.beforeEach(async ({ page }) => {
  await installWakeLockMock(page);
});

test.describe("home, navigation, and help", () => {
  test("shows every tool and navigates to its page", async ({ page }) => {
    await resetApp(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Tu compañera de mesa",
    );

    const routes = [
      "/counter",
      "/choasis",
      "/timer",
      "/score-sheet",
      "/dice",
      "/help",
    ];

    for (const route of routes) {
      await page.getByRole("main").locator(`a[href="${route}"]`).last().click();
      await expect(page).toHaveURL(new RegExp(`${route}$`));
      await page.goto("/");
    }
    await expect(page.getByRole("heading", { name: "Más" })).toBeVisible();
  });

  test("opens the app menu and remembers the last used tool", async ({ page }) => {
    await resetApp(page, "/timer");
    await page.goto("/");
    await expect(page.getByRole("link", { name: /Continuar.*Temporizador/i })).toBeVisible();

    await page.getByRole("button", { name: "Menú de navegación" }).first().click();
    const menu = page.getByRole("dialog", { name: "Menú de navegación" });
    await expect(menu.getByRole("link", { name: "Configuración" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Ayuda" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Enviar feedback" })).toBeVisible();
    await menu.getByRole("link", { name: "Tiradados" }).click();
    await expect(page).toHaveURL(/\/dice$/);
  });

  test("keeps installation guidance available when the browser has no native prompt", async ({ page }) => {
    await resetApp(page);
    await page.getByRole("button", { name: "Instalar aplicación" }).click();
    await expect(page.getByRole("dialog", { name: "Instalar en iPhone o iPad" })).toBeVisible();
    await expect(page.getByText(/Añadir a pantalla de inicio/)).toBeVisible();
  });

  test("documents all available tools", async ({ page }) => {
    await resetApp(page, "/help");
    for (const heading of [
      "Configuración",
      "Counters",
      "Choasis",
      "Temporizador",
      "Tiradados",
      "Hoja de puntuación",
    ]) {
      await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    }
    await expect(page.getByText(/Vaciar bandeja/)).toBeVisible();
    await expect(page.getByText(/caras o cruces/)).toBeVisible();
    await expect(page.getByText(/diez tiradas más recientes/)).toBeVisible();
  });
});

test.describe("offline PWA", () => {
  test("opens every tool and essential assets without a connection", async ({
    page,
    context,
  }) => {
    await resetApp(page);
    await page.waitForFunction(async () => {
      if (!("serviceWorker" in navigator)) return false;
      await navigator.serviceWorker.ready;
      if (navigator.serviceWorker.controller) return true;
      return new Promise<boolean>((resolve) => {
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => resolve(Boolean(navigator.serviceWorker.controller)),
          { once: true },
        );
      });
    });

    await context.setOffline(true);

    for (const route of [
      "/",
      "/counter",
      "/choasis",
      "/timer",
      "/score-sheet",
      "/dice",
      "/help",
      "/settings",
    ]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main")).toBeVisible();
    }

    await page.goto("/timer", { waitUntil: "domcontentloaded" });
    await page.getByRole("spinbutton", { name: "Segundos" }).fill("12");
    await expect(page.getByRole("timer")).toHaveText("00:12");
    await expect
      .poll(() =>
        page.evaluate(() =>
          localStorage.getItem("bg-counter-timer-duration-seconds"),
        ),
      )
      .toBe("12");

    await expect
      .poll(() =>
        page.evaluate(async () => {
          const [manifest, appleIcon, alarm] = await Promise.all([
            fetch("/manifest.webmanifest"),
            fetch("/apple-touch-icon.png"),
            fetch("/sounds/universfield-digital-alarm-clock-151927.mp3"),
          ]);
          return {
            manifest: manifest.ok,
            appleIcon: appleIcon.ok,
            alarm: alarm.ok,
          };
        }),
      )
      .toEqual({ manifest: true, appleIcon: true, alarm: true });

    await context.setOffline(false);
  });
});

test.describe("global settings and wake lock", () => {
  test("persists language and theme across reloads", async ({ page }) => {
    await resetApp(page, "/settings");
    await page.getByRole("button", { name: "English" }).click();
    await page.getByRole("button", { name: "Dark" }).click();

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
  });

  test("acquires, releases, and restores the saved wake lock preference", async ({ page }) => {
    await resetApp(page);
    await page.getByRole("button", { name: "Menú de navegación" }).first().click();
    const wakeSwitch = page.getByRole("switch", {
      name: "Mantener la pantalla encendida",
    });
    await expect(wakeSwitch).toBeChecked();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (window as unknown as { __wakeLockState: { requests: number } })
              .__wakeLockState.requests,
        ),
      )
      .toBeGreaterThan(0);

    await wakeSwitch.click();
    await expect(wakeSwitch).not.toBeChecked();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (window as unknown as { __wakeLockState: { releases: number } })
              .__wakeLockState.releases,
        ),
      )
      .toBeGreaterThan(0);
    await page.reload();
    await page.getByRole("button", { name: "Menú de navegación" }).first().click();
    await expect(
      page.getByRole("switch", { name: "Mantener la pantalla encendida" }),
    ).not.toBeChecked();
  });
});

test.describe("timer", () => {
  test("counts down, pauses, resumes, and restores its configured duration", async ({ page }) => {
    await resetApp(page, "/timer");
    await expect(page.getByRole("timer")).toHaveText("00:30");
    await page.getByRole("spinbutton", { name: "Minutos" }).fill("0");
    await page.getByRole("spinbutton", { name: "Segundos" }).fill("3");
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await expect(page.getByRole("button", { name: "Detener" })).toBeEnabled();
    await expect(page.getByRole("timer")).not.toHaveText("00:03", { timeout: 2_000 });
    await page.getByRole("button", { name: "Detener" }).click();
    await expect(page.getByRole("button", { name: "Reanudar" })).toBeEnabled();
    await page.getByRole("button", { name: "Reiniciar" }).click();
    await expect(page.getByRole("timer")).toHaveText("00:03");

    await page.reload();
    await expect(page.getByRole("spinbutton", { name: "Segundos" })).toHaveValue("3");
  });

  test("finishes a short countdown and announces it", async ({ page }) => {
    await resetApp(page, "/timer");
    await page.getByRole("spinbutton", { name: "Minutos" }).fill("0");
    await page.getByRole("spinbutton", { name: "Segundos" }).fill("1");
    await page.getByRole("button", { name: "Iniciar", exact: true }).click();
    await expect(page.getByRole("timer")).toHaveText("00:00", { timeout: 3_000 });
    await expect(page.getByText("¡Tiempo finalizado!").first()).toBeVisible();
  });
});

test.describe("dice roller", () => {
  test("combines dice, restores their shapes and resets the configuration", async ({
    page,
  }) => {
    await resetApp(page, "/dice");
    await page.getByRole("button", { name: "Añadir d6" }).click();
    await page.getByRole("button", { name: "Añadir d20" }).click();
    await page.getByRole("button", { name: "Añadir Moneda" }).click();
    await expect(page.getByRole("button", { name: "Quitar d6" })).toHaveCount(2);
    await page.getByRole("button", { name: "Lanzar" }).click();
    await expect(page.getByRole("button", { name: "Tirando..." })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Lanzar" })).toBeEnabled();

    await expect
      .poll(() =>
        page.evaluate(() => {
          const state = JSON.parse(
            localStorage.getItem("bg-counter-dice-roller") ?? "{}",
          );
          return state.history?.[0] ?? null;
        }),
      )
      .not.toBeNull();

    const persisted = await page.evaluate(() => {
      const state = JSON.parse(
        localStorage.getItem("bg-counter-dice-roller") ?? "{}",
      );
      return state;
    });
    expect(persisted.configuration).toMatchObject({ 6: 2, 20: 1, coin: 1 });
    expect(persisted.history[0].items).toHaveLength(4);
    expect(persisted.history[0].total).toBe(
      persisted.history[0].items.reduce(
        (sum: number, item: { kind: string; value: number | string }) =>
          sum + (item.kind === "die" ? Number(item.value) : 0),
        0,
      ),
    );

    await page.reload();
    await expect(page.getByRole("button", { name: "Quitar d6" })).toHaveCount(2);
    await expect(page.getByRole("button", { name: "Quitar d20" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Quitar Moneda" })).toBeVisible();
    await expect(page.getByTestId("dice-total")).toHaveText(
      String(persisted.history[0].total),
    );
    await expect(page.getByLabel(/Resultado d6:/)).toHaveCount(4);
    await expect(page.getByLabel(/Resultado d20:/)).toHaveCount(2);
    await expect(page.getByLabel(/Resultado Moneda:/)).toHaveCount(2);

    await page.getByRole("button", { name: "Vaciar bandeja" }).click();
    await expect(page.getByRole("button", { name: "Lanzar" })).toBeDisabled();
    await page.reload();
    await expect(page.getByRole("button", { name: /^Quitar/ })).toHaveCount(0);
  });
});

test.describe("score sheet", () => {
  test("adds structure, calculates a winner, persists, and clears scores", async ({
    page,
  }, testInfo) => {
    await resetApp(page, "/score-sheet");
    await page.getByRole("textbox", { name: "Jugador 1", exact: true }).fill("Ana");
    await page.getByRole("textbox", { name: "Jugador 2", exact: true }).fill("Luis");
    await page.getByRole("textbox", { name: "Concepto 1", exact: true }).fill("Ronda");
    await page.getByRole("spinbutton", { name: "Puntuación: Ana, Ronda", exact: true }).fill("12");
    await page.getByRole("spinbutton", { name: "Puntuación: Luis, Ronda", exact: true }).fill("8");
    await expect(page.getByText("Ganador actual: Ana")).toBeVisible();
    await expect(page.getByTitle("Mayor puntuación")).toHaveText("12");

    await page.getByLabel("Añadir jugador").click();
    await expect(page.getByRole("textbox", { name: "Jugador 3", exact: true })).toBeVisible();
    await page.getByLabel("Añadir concepto").click();
    await expect(page.getByRole("textbox", { name: "Concepto 2", exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("textbox", { name: "Jugador 1", exact: true })).toHaveValue("Ana");
    await expect(page.getByRole("textbox", { name: "Concepto 1", exact: true })).toHaveValue("Ronda");

    await openOptionsMenu(page);
    await page.getByRole("button", { name: "Limpiar puntuaciones" }).click();
    await expect(page.getByRole("spinbutton", { name: "Puntuación: Ana, Ronda", exact: true })).toHaveValue("");
    await expect(page.getByRole("textbox", { name: "Jugador 1", exact: true })).toHaveValue("Ana");
  });

  test("resets to one player and one concept and protects both", async ({ page }, testInfo) => {
    await resetApp(page, "/score-sheet");
    await openOptionsMenu(page);
    await page.getByRole("button", { name: "Restablecer tabla" }).click();
    await expect(page.getByPlaceholder("Jugador 1")).toHaveCount(1);
    await expect(page.getByPlaceholder("Concepto 1")).toHaveCount(1);
    await expect(page.getByTitle("Eliminar jugador")).toBeDisabled();
    await expect(page.getByTitle("Eliminar concepto")).toBeDisabled();
  });
});

test.describe("counters", () => {
  test("can select an empty layout and add a counter from the navigation", async ({
    page,
  }, testInfo) => {
    await resetApp(page, "/counter");
    await openOptionsMenu(page);
    await page.locator("#game:visible").selectOption("empty");
    await expect(page.getByText("No hay contadores")).toBeVisible();

    await openOptionsMenu(page);
    await page.getByRole("button", { name: "Añadir" }).click();
    await expect(page.getByText("No hay contadores")).toBeHidden();
    await expect
      .poll(() =>
        page.evaluate(() => JSON.parse(localStorage.getItem("current-counters") ?? "[]").length),
      )
      .toBe(1);
  });

  test("persists the selected game and template", async ({ page }, testInfo) => {
    await resetApp(page, "/counter");
    await openOptionsMenu(page);
    await page.locator("#game:visible").selectOption("magic");
    await page.locator("#template:visible").selectOption("duel");
    await expect
      .poll(() =>
        page.evaluate(() => {
          const counters = JSON.parse(
            localStorage.getItem("current-counters") ?? "[]",
          ) as Array<{ id: string; initialValue: number }>;
          return {
            game: localStorage.getItem("selected-game"),
            template: localStorage.getItem("selected-template"),
            counters: counters.map(({ id, initialValue }) => ({
              id,
              initialValue,
            })),
          };
        }),
      )
      .toEqual({
        game: "magic",
        template: "duel",
        counters: [
          { id: "player1", initialValue: 20 },
          { id: "player2", initialValue: 20 },
        ],
      });
    await page.reload();
    await openOptionsMenu(page);
    await expect(page.locator("#game:visible")).toHaveValue("magic");
    await expect(page.locator("#template:visible")).toHaveValue("duel");
  });

  test("counts, resets, edits, and deletes counters while persisting every change", async ({
    page,
  }, testInfo) => {
    await resetApp(page, "/counter");
    await openOptionsMenu(page);
    await page.locator("#game:visible").selectOption("magic");
    await page.locator("#template:visible").selectOption("duel");

    const increment = page.getByLabel("Sumar a Ajani");
    if (testInfo.project.name.includes("mobile")) {
      await increment.tap();
    } else {
      await increment.click();
    }
    await expect
      .poll(() =>
        page.evaluate(() => {
          const counters = JSON.parse(localStorage.getItem("current-counters") ?? "[]");
          return counters[0]?.value;
        }),
      )
      .toBe(21);

    await openOptionsMenu(page);
    await page.getByRole("button", { name: "Reiniciar" }).click();
    await expect
      .poll(() =>
        page.evaluate(() => {
          const counters = JSON.parse(localStorage.getItem("current-counters") ?? "[]");
          return counters[0]?.value;
        }),
      )
      .toBe(20);

    await page.getByTitle("Opciones").first().click();
    await page.getByRole("button", { name: "Editar" }).click();
    await page.getByLabel("Nombre").fill("Vida principal");
    await page.getByLabel("Valor por defecto").fill("25");
    await page.getByRole("button", { name: "Guardar" }).click();

    await expect
      .poll(() =>
        page.evaluate(() => ({
          template: localStorage.getItem("selected-template"),
          counter: JSON.parse(localStorage.getItem("current-counters") ?? "[]")[0],
        })),
      )
      .toMatchObject({
        template: "custom",
        counter: { name: "Vida principal", initialValue: 25, value: 25 },
      });

    await page.reload();
    await expect(page.getByText("Vida principal", { exact: true })).toHaveCount(1);
    await expect
      .poll(() =>
        page.evaluate(() =>
          JSON.parse(localStorage.getItem("current-counters") ?? "[]")[0]?.name,
        ),
      )
      .toBe("Vida principal");
    await page.getByTitle("Opciones").first().click();
    await page.getByRole("button", { name: "Eliminar" }).click();
    await expect(page.getByText("Vida principal", { exact: true })).toHaveCount(0);
    await expect
      .poll(() =>
        page.evaluate(() => JSON.parse(localStorage.getItem("current-counters") ?? "[]").length),
      )
      .toBe(1);
  });
});

test.describe("choasis", () => {
  test("manual mode picks a player within the configured range", async ({ page }, testInfo) => {
    await resetApp(page, "/choasis");
    if (testInfo.project.name.includes("mobile")) {
      await openMenuOnMobile(page, testInfo.project.name);
      await page.getByRole("button", { name: "Modo manual" }).click();
    }
    await expect(page.getByText("Modo manual", { exact: true }).last()).toBeVisible();
    await page.getByLabel("Número de jugadores").fill("4");
    await page.getByRole("button", { name: "Elegir" }).click();
    await expect(page.getByRole("button", { name: "Elegir" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Elegir" })).toBeEnabled({
      timeout: 4_000,
    });
    await expect(page.locator(".ring-primary").getByText(/^[1-4]$/)).toBeVisible();
  });
});
