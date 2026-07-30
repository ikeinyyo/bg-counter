"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "es" | "en" | "it";
export type Theme = "light" | "dark" | "system";

type SettingsContextValue = {
  language: Language;
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
};

const STORAGE_KEY = "bg-counter-settings";

const translations = {
  es: {
    homeTitle: "Tu compañera de mesa para tus partidas.",
    homeDescription:
      "App companion con utilidades para juegos de mesa: contadores y más. Diseñada para uso móvil y rápido.",
    languageLabel: "Idioma",
    themeLabel: "Tema",
    themeLight: "Claro",
    themeDark: "Oscuro",
    themeSystem: "Sistema",
    languageEs: "Español",
    languageEn: "English",
    languageIt: "Italiano",
    counterTitle: "Counters",
    counterDescription: "Gestiona tus contadores de vida, recursos y puntos.",
    soonTitle: "Pronto",
    soonDescription: "Más herramientas llegarán en próximas actualizaciones.",
    editorTitle: "Editar contador",
    labelName: "Nombre",
    placeholderCounterName: "Nombre del contador",
    labelDefaultValue: "Valor por defecto",
    labelBackgroundColor: "Color de fondo",
    labelIcon: "Icono",
    labelPreview: "Vista previa",
    actionCancel: "Cancelar",
    actionSave: "Guardar",
    actionSaving: "Guardando...",
    menuEdit: "Editar",
    menuDelete: "Eliminar",
    menuOptions: "Opciones",
    emptyCounters:
      "No hay contadores. Añade uno para comenzar o selecciona una plantilla.",
    loadingCountersAria: "Cargando contadores",
    loadingCounters: "Cargando contadores...",
    loadingSoon: "No tardará mucho",
    footerAllRights: "Todos los derechos reservados.",
    appTitle: "Companion",
    logoAlt: "Logo de Juernes de Mesa",
    barReset: "Reiniciar",
    barAddCounter: "Añadir contador",
    close: "Cerrar",
    colorPickerAria: "Selector de color",
    iconPickerAria: "Selector de icono",
    templateLabel: "Plantilla",
    template_custom: "Personalizada",
    template_empty: "Vacía",
    template_marvelSolo: "Marvel Champions - 1J",
    template_marvelSoloCounters: "Marvel Champions - 1J+",
    template_marvel2P: "Marvel Champions - 2J",
    template_marvel3P: "Marvel Champions - 3J",
    template_marvel4P: "Marvel Champions - 4J",
    template_commander: "Commander",
    template_duel: "Duelo",
    template_lifeEnergy: "Vida/Energía",
    template_life3: "3 Jugadores",
    template_life4: "4 Jugadores",
    template_life5: "5 Jugadores",
    template_life6: "6 Jugadores",
    choasisTitle: "Choasis",
    choasisDescription:
      "Sirve para elegir jugador inicial o elegir a un jugador de entre todos.",
    choasisPlaceholder: "Pon tu dedo para comenzar la elección",
    choasisResetHint: "Toca para reiniciar",
  },
  en: {
    homeTitle: "Your tabletop companion for game nights.",
    homeDescription:
      "Companion app with handy tools for board games — counters and more. Designed for quick, mobile use.",
    languageLabel: "Language",
    themeLabel: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    languageEs: "Español",
    languageEn: "English",
    languageIt: "Italiano",
    counterTitle: "Counters",
    counterDescription: "Manage your life, resource, and point counters.",
    soonTitle: "Coming soon",
    soonDescription: "More tools will arrive in upcoming updates.",
    editorTitle: "Edit Counter",
    labelName: "Name",
    placeholderCounterName: "Counter name",
    labelDefaultValue: "Default value",
    labelBackgroundColor: "Background color",
    labelIcon: "Icon",
    labelPreview: "Preview",
    actionCancel: "Cancel",
    actionSave: "Save",
    actionSaving: "Saving...",
    menuEdit: "Edit",
    menuDelete: "Delete",
    menuOptions: "Options",
    emptyCounters: "No counters. Add one to start or pick a template.",
    loadingCountersAria: "Loading counters",
    loadingCounters: "Loading counters...",
    loadingSoon: "It will not take long",
    footerAllRights: "All rights reserved.",
    appTitle: "Companion",
    logoAlt: "Juernes de Mesa logo",
    barReset: "Reset",
    barAddCounter: "Add Counter",
    close: "Close",
    colorPickerAria: "Color Picker",
    iconPickerAria: "Icon Picker",
    templateLabel: "Template",
    template_custom: "Custom",
    template_empty: "Empty",
    template_marvelSolo: "Marvel Champions - 1P",
    template_marvelSoloCounters: "Marvel Champions - 1P+",
    template_marvel2P: "Marvel Champions - 2P",
    template_marvel3P: "Marvel Champions - 3P",
    template_marvel4P: "Marvel Champions - 4P",
    template_commander: "Commander",
    template_duel: "Duel",
    template_lifeEnergy: "Life/Energy",
    template_life3: "3 Players",
    template_life4: "4 Players",
    template_life5: "5 Players",
    template_life6: "6 Players",
    choasisTitle: "Choasis",
    choasisDescription:
      "Pick the starting player or choose one from all players.",
    choasisPlaceholder: "Place your finger to start",
    choasisResetHint: "Tap to reset",
  },
  it: {
    homeTitle: "La tua compagna di gioco al tavolo.",
    homeDescription:
      "App companion con utilità per i giochi da tavolo: contatori e altro. Progettata per l’uso mobile e rapido.",
    languageLabel: "Lingua",
    themeLabel: "Tema",
    themeLight: "Chiaro",
    themeDark: "Scuro",
    themeSystem: "Sistema",
    languageEs: "Español",
    languageEn: "English",
    languageIt: "Italiano",
    counterTitle: "Counters",
    counterDescription: "Gestisci i tuoi contatori di vita, risorse e punti.",
    soonTitle: "Presto",
    soonDescription: "Altri strumenti arriveranno nei prossimi aggiornamenti.",
    editorTitle: "Modifica contatore",
    labelName: "Nome",
    placeholderCounterName: "Nome del contatore",
    labelDefaultValue: "Valore predefinito",
    labelBackgroundColor: "Colore di sfondo",
    labelIcon: "Icona",
    labelPreview: "Anteprima",
    actionCancel: "Annulla",
    actionSave: "Salva",
    actionSaving: "Salvataggio...",
    menuEdit: "Modifica",
    menuDelete: "Elimina",
    menuOptions: "Opzioni",
    emptyCounters: "Nessun contatore. Aggiungine uno o scegli un modello.",
    loadingCountersAria: "Caricamento contatori",
    loadingCounters: "Caricamento contatori...",
    loadingSoon: "Non ci vorrà molto",
    footerAllRights: "Tutti i diritti riservati.",
    appTitle: "Companion",
    logoAlt: "Logo di Juernes de Mesa",
    barReset: "Reimposta",
    barAddCounter: "Aggiungi contatore",
    close: "Chiudi",
    colorPickerAria: "Selettore colore",
    iconPickerAria: "Selettore icone",
    templateLabel: "Modello",
    template_custom: "Personalizzata",
    template_empty: "Vuota",
    template_marvelSolo: "Marvel Champions - 1G",
    template_marvelSoloCounters: "Marvel Champions - 1G+",
    template_marvel2P: "Marvel Champions - 2G",
    template_marvel3P: "Marvel Champions - 3G",
    template_marvel4P: "Marvel Champions - 4G",
    template_commander: "Commander",
    template_duel: "Duello",
    template_lifeEnergy: "Vita/Energia",
    template_life3: "3 Giocatori",
    template_life4: "4 Giocatori",
    template_life5: "5 Giocatori",
    template_life6: "6 Giocatori",
    choasisTitle: "Choasis",
    choasisDescription:
      "Serve per scegliere il giocatore iniziale o uno tra tutti.",
    choasisPlaceholder: "Appoggia il dito per iniziare",
    choasisResetHint: "Tocca per reimpostare",
  },
} as const;

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const resolveTheme = (theme: Theme): "light" | "dark" => {
  if (theme === "system") return getSystemTheme();
  return theme;
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<{
        language: Language;
        theme: Theme;
      }>;

      if (parsed.language && ["es", "en", "it"].includes(parsed.language)) {
        setLanguageState(parsed.language as Language);
      }

      if (parsed.theme && ["light", "dark", "system"].includes(parsed.theme)) {
        setThemeState(parsed.theme as Theme);
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nextResolvedTheme = resolveTheme(theme);
    setResolvedTheme(nextResolvedTheme);

    document.documentElement.setAttribute("data-theme", nextResolvedTheme);
    document.documentElement.style.colorScheme = nextResolvedTheme;
    document.documentElement.lang = language;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ language, theme }),
    );
  }, [language, theme]);

  useEffect(() => {
    if (typeof window === "undefined" || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () =>
      setResolvedTheme(mediaQuery.matches ? "dark" : "light");

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.setAttribute("data-theme", resolvedTheme);
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  };

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
  };

  const t = (key: string) => {
    const dict = translations[language] ?? translations.es;
    return dict[key as keyof typeof dict] ?? key;
  };

  const value = useMemo(
    () => ({
      language,
      theme,
      resolvedTheme,
      setLanguage,
      setTheme,
      t,
    }),
    [language, resolvedTheme, theme, t],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used inside a SettingsProvider");
  }
  return context;
}

export function useTranslation() {
  return useSettings();
}
