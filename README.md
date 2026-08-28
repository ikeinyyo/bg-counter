This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Feedback

The main tools menu includes a feedback action. Set the form URL at container
runtime or in `.env.local`:

```bash
NEXT_PUBLIC_FEEDBACK_FORM_URL="https://forms.example.com/feedback"
```

`FEEDBACK_FORM_URL` is also accepted as an alias. The URL is loaded at runtime,
so changing it only requires restarting the container, not rebuilding the
image. If it is missing or invalid, the action opens an email addressed to
`info@juernesdemesa.com`.

## Application Insights

Copy `.env.example` to `.env.local` and set the connection string from the
Application Insights resource:

```bash
NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=...;IngestionEndpoint=..."
```

The variable is intentionally public because telemetry is sent by the browser;
do not put an Azure API key or another secret in it. Without the variable the
telemetry layer is a no-op. The app reads it at runtime from the server through
`/api/telemetry-config`, so the same image can be promoted between environments
without rebuilding it. `APPLICATIONINSIGHTS_CONNECTION_STRING` is also accepted
as an alias.

For Docker or a container service, set either variable when the container is
started:

```bash
docker run \
  -e NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=...;IngestionEndpoint=..." \
  bg-counter
```

Page views, client errors, dependencies and usage events are tracked. Custom
events cover tool navigation, counter templates and actions, dice configurations
and rolls, timer durations, Choasis selections, score-sheet structure, and app
preferences. User-entered names and labels are not sent.

Example KQL queries:

```kusto
// Herramientas más usadas, con usuarios y sesiones únicas
pageViews
| where name in ("/counter", "/choasis", "/timer", "/score-sheet", "/dice", "/help")
| summarize Visits=count(), Users=dcount(user_Id), Sessions=dcount(session_Id) by Tool=name
| order by Visits desc

// Uso diario y usuarios activos
pageViews
| summarize Visits=count(), ActiveUsers=dcount(user_Id), Sessions=dcount(session_Id)
  by Day=startofday(timestamp)
| order by Day asc

// Herramientas abiertas desde la portada
customEvents
| where name == "tool_opened"
| summarize Opens=count(), Users=dcount(user_Id)
  by Tool=tostring(customDimensions.path)
| order by Opens desc

// Plantillas de counters más seleccionadas
customEvents
| where name == "counter_template_selected"
| summarize Uses=count(), Users=dcount(user_Id),
    AverageCounters=avg(todouble(customMeasurements.counterCount))
  by Template=tostring(customDimensions.templateId),
     Game=tostring(customDimensions.gameId)
| order by Uses desc

// Juegos de counters más seleccionados
customEvents
| where name == "counter_game_selected"
| summarize Uses=count(), Users=dcount(user_Id)
  by Game=tostring(customDimensions.gameId)
| order by Uses desc

// Acciones de counters más habituales
customEvents
| where name startswith "counter" or name == "counters_reset"
| summarize Uses=count(), Users=dcount(user_Id) by Action=name
| order by Uses desc

// Dados y monedas más lanzados (cantidad real de piezas, no solo tiradas)
customEvents
| where name == "dice_rolled"
| extend Configuration=tostring(customDimensions.configuration)
| mv-expand Piece=split(Configuration, ",")
| extend Parts=split(tostring(Piece), ":")
| extend PieceType=tostring(Parts[0]), Quantity=toint(Parts[1])
| summarize PiecesRolled=sum(Quantity), RollsContainingPiece=count(),
    Users=dcount(user_Id) by PieceType
| order by PiecesRolled desc

// Combinaciones de dados más frecuentes
customEvents
| where name == "dice_rolled"
| summarize Rolls=count(), Users=dcount(user_Id),
    AveragePieces=avg(todouble(customMeasurements.pieceCount))
  by Configuration=tostring(customDimensions.configuration)
| order by Rolls desc

// Duraciones de timer más utilizadas
customEvents
| where name == "timer_started"
| summarize Uses=count(), Users=dcount(user_Id)
  by Seconds=toint(customMeasurements.configuredDurationSeconds)
| order by Uses desc

// Tasa de finalización de timers
customEvents
| where name in ("timer_started", "timer_completed", "timer_paused", "timer_reset")
| summarize Starts=countif(name == "timer_started"),
    Completions=countif(name == "timer_completed"),
    Pauses=countif(name == "timer_paused"),
    Resets=countif(name == "timer_reset")
| extend CompletionRate=round(100.0 * Completions / Starts, 1)

// Modo de Choasis más usado y número habitual de jugadores
customEvents
| where name == "choasis_selection_completed"
| summarize Selections=count(), Users=dcount(user_Id),
    AveragePlayers=avg(todouble(customMeasurements.playerCount)),
    P50Players=percentile(todouble(customMeasurements.playerCount), 50),
    P95Players=percentile(todouble(customMeasurements.playerCount), 95)
  by Mode=tostring(customDimensions.mode)
| order by Selections desc

// Preferencias más elegidas: tema, idioma y wake lock
customEvents
| where name == "setting_changed"
| summarize Changes=count(), Users=dcount(user_Id)
  by Setting=tostring(customDimensions.setting), Value=tostring(customDimensions.value)
| order by Setting asc, Changes desc

// Uso instalado como PWA frente a navegador
customEvents
| where name == "app_loaded"
| summarize Loads=count(), Users=dcount(user_Id)
  by DisplayMode=tostring(customDimensions.displayMode)
| order by Loads desc

// Eventos de producto más frecuentes, excluyendo carga y ajustes
customEvents
| where name !in ("app_loaded", "setting_changed")
| summarize Uses=count(), Users=dcount(user_Id) by Event=name
| order by Uses desc

// Excepciones más frecuentes por página
exceptions
| summarize Occurrences=count(), Users=dcount(user_Id)
  by Problem=problemId, Page=operation_Name
| order by Occurrences desc
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

docker buildx build --platform linux/amd64 -t crgallardoglobalshared.azurecr.io/counter:v1.0.1 --push .

docker buildx build --platform linux/amd64 -t crgallardoglobalshared.azurecr.io/counter:v2.0.0 --push .

## Tests

Integration tests use Vitest, jsdom, and Testing Library:

```bash
pnpm test
pnpm test:coverage
pnpm test:watch
```

Functional tests use Playwright and run against desktop and mobile Chromium:

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

Playwright builds and starts the production application so it can also verify
the service worker and every tool while the browser is offline.

Run both suites with:

```bash
pnpm test:all
```

Playwright starts the Next.js development server automatically on
`127.0.0.1:3000`. Reports and traces are written to ignored test-output
directories.

The regression suite protects these user-facing contracts:

- global language, theme, footer wake lock, navigation, and help content;
- counter templates, custom edits, counting, reset, deletion, and storage;
- Choasis manual selection, limits, and the five-player touch boundary;
- timer configuration, controls, persistence, completion, and alarm request;
- dice configuration, animated rolls, totals, history, and persistence;
- score-sheet structure, totals, winner, clearing, reset, and persistence.

Vitest exercises state and component integration quickly. Playwright repeats
the critical journeys in real desktop and mobile Chromium. New behavior should
be added to this list and receive a regression test at the lowest useful layer;
critical journeys should also receive an end-to-end test.

## Offline use and installation

The production build registers a service worker powered by Serwist. On the
first online visit it precaches every tool, the application shell, images, and
the timer alarm. Later visits work without a connection, both in the browser
and when the PWA is added to the device home screen. Development mode leaves
the service worker disabled to prevent stale caches while coding.
