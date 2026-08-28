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

export const translations = {
  es: {
    homeTitle: "Tu compañera de mesa para tus partidas.",
    homeDescription:
      "App companion con utilidades para juegos de mesa: contadores y más. Diseñada para uso móvil y rápido.",
    homeEyebrow: "Tu mesa, siempre preparada",
    homeContinue: "Continuar",
    homeContinueHint: "Retoma exactamente donde lo dejaste",
    homeFavorites: "Tus favoritas",
    homeFavoritesHint: "Elige hasta cuatro accesos rápidos y ordénalos a tu gusto.",
    homeAllTools: "Todas las herramientas",
    homeMore: "Más",
    favoriteAdd: "Añadir a favoritas",
    favoriteRemove: "Quitar de favoritas",
    favoriteReorder: "Reordenar",
    favoriteReorderTitle: "Ordenar favoritas",
    favoriteReorderHint: "Arrastra desde el asa para cambiar su posición en la barra inferior.",
    favoriteLimit: "Desmarca una favorita antes de añadir otra",
    navigationMenu: "Menú de navegación",
    navigationPrimary: "Navegación principal",
    navigationHome: "Inicio",
    navigationTools: "Herramientas",
    navigationMore: "Más",
    navigationBack: "Volver",
    navToolActions: "Opciones de la herramienta",
    settingsTitle: "Configuración",
    settingsDescription: "Personaliza el aspecto y el idioma de la aplicación.",
    settingsAppearance: "Apariencia",
    settingsLanguage: "Idioma de la aplicación",
    settingsTheme: "Tema visual",
    settingsAbout: "Acerca de",
    settingsVersion: "Versión",
    settingsSaved: "Los cambios se guardan automáticamente en este dispositivo.",
    installApp: "Instalar aplicación",
    installAppHint: "Añádela a tu pantalla de inicio para abrirla como una app.",
    installIosTitle: "Instalar en iPhone o iPad",
    installIosChromeDescription: "Chrome en iPhone no permite que la web abra el instalador automáticamente. Puedes añadirla desde el menú Compartir.",
    installIosChromeStepShare: "Pulsa Compartir en Chrome.",
    installIosSafariDescription: "Safari no muestra un botón de instalación automático. Puedes añadir la app desde su menú Compartir.",
    installIosSafariStepShare: "Pulsa Compartir en Safari.",
    installIosOtherDescription: "En iPhone o iPad, la instalación se realiza desde las opciones para compartir del navegador.",
    installAndroidTitle: "Instalar en Android",
    installAndroidDescription: "Si el navegador no muestra el instalador automático, puedes añadir la app desde su menú.",
    installAndroidStepMenu: "Abre el menú del navegador.",
    installDesktopTitle: "Instalar en este dispositivo",
    installDesktopDescription: "Si no aparece el instalador automático, busca la opción de instalación en el menú del navegador.",
    installDesktopStepMenu: "Abre las opciones del navegador.",
    installGenericStepMenu: "Abre Compartir o las opciones del navegador.",
    installGenericStepAdd: "Selecciona «Añadir a pantalla de inicio» o «Instalar aplicación».",
    installGenericFallback: "Si no ves esa opción, abre esta página en otro navegador compatible o consulta su menú de ayuda.",
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
    menuDuplicate: "Duplicar",
    counterCopySuffix: "copia",
    menuDelete: "Eliminar",
    menuOptions: "Opciones",
    counterDecrement: "Restar a",
    counterIncrement: "Sumar a",
    emptyCounters: "No hay contadores",
    emptyCountersHint:
      "Selecciona una plantilla o añade un contador desde el menú de navegación.",
    emptyAddCounter: "Crear contador",
    loadingCountersAria: "Cargando contadores",
    loadingCounters: "Cargando contadores...",
    loadingSoon: "No tardará mucho",
    footerAllRights: "Todos los derechos reservados.",
    feedbackLabel: "Enviar feedback",
    feedbackDescription: "Comparte sugerencias, errores o ideas para mejorar la aplicación.",
    wakeLockLabel: "Mantener la pantalla encendida",
    wakeLockShortLabel: "Pantalla siempre activa",
    wakeLockActive: "Pantalla siempre encendida: activada",
    wakeLockInactive: "Pantalla siempre encendida: desactivada",
    wakeLockUnsupported:
      "Este navegador no permite mantener la pantalla encendida",
    helpTitle: "Ayuda",
    helpDescription:
      "Consulta cómo moverte por Companion, personalizarla e instalarla, además de las funciones de cada herramienta.",
    helpNavigationTitle: "Inicio y navegación",
    helpNavigationText:
      "La pantalla de inicio reúne tus accesos rápidos, la última herramienta utilizada y el catálogo completo. En móvil, Inicio y tus cuatro favoritas permanecen en la barra inferior; en pantallas grandes aparecen como pestañas junto al logo.",
    helpNavigationFavoritesTitle: "Herramientas favoritas",
    helpNavigationFavoritesText:
      "Marca o desmarca la estrella de una herramienta para añadirla o quitarla. Puedes guardar un máximo de cuatro. Pulsa «Reordenar» en Inicio y arrastra cada fila desde su asa para cambiar el orden de la barra y de las pestañas.",
    helpNavigationMenuTitle: "Menú y regreso",
    helpNavigationMenuText:
      "El botón de hamburguesa abre todas las herramientas y los accesos a Configuración, Ayuda y Feedback. Las pantallas secundarias también ofrecen un botón para volver; cada herramienta muestra sus propias opciones a la derecha.",
    helpInstallTitle: "Instalar Companion",
    helpInstallText:
      "Desde «Más» en Inicio, pulsa «Instalar aplicación». Una vez instalada, Companion se abre a pantalla completa y funciona como una aplicación independiente.",
    helpInstallAutomaticTitle: "Instalación automática",
    helpInstallAutomaticText:
      "Cuando el navegador lo permite, Companion abre directamente el diálogo de instalación del sistema. Confirma la operación para añadirla a tus aplicaciones.",
    helpInstallIosTitle: "iPhone, iPad y otros navegadores",
    helpInstallIosText:
      "Si no aparece un instalador automático, abre Compartir o el menú del navegador y elige «Añadir a pantalla de inicio» o «Instalar aplicación». La guía mostrada se adapta a Chrome, Safari, Android o escritorio.",
    helpConfigTitle: "Configuración",
    helpConfigText:
      "Idioma y tema se gestionan desde Configuración. La pantalla también incluye la versión instalada. La opción de mantener la pantalla activa permanece accesible en el menú de navegación para poder cambiarla durante una partida.",
    helpConfigOptionsTitle: "Opciones disponibles",
    helpConfigLanguage:
      "Idioma: cambia todos los textos de la aplicación entre español, inglés e italiano.",
    helpConfigTheme:
      "Tema: elige entre el modo claro, el modo oscuro o el aspecto configurado en tu sistema.",
    helpConfigWakeLock:
      "Pantalla siempre activa: evita que el dispositivo apague la pantalla mientras estás usando la aplicación. Resulta especialmente útil durante una partida con los contadores. La opción está activada la primera vez y recuerda el último valor elegido.",
    helpConfigVersion:
      "Acerca de: muestra la versión actual de Companion.",
    helpCountersTitle: "Counters",
    helpCountersText:
      "La herramienta de contadores permite preparar un marcador adaptado a cada partida y modificarlo cuando lo necesites.",
    helpCountersMenuTitle: "Plantillas y nuevos contadores",
    helpCountersMenuText:
      "Abre las opciones de la herramienta en la barra superior para elegir un juego y una distribución. Una plantilla crea de una vez los contadores más habituales. Desde el mismo panel puedes reiniciar sus valores o añadir un contador nuevo.",
    helpCountersEditTitle: "Editar un contador",
    helpCountersEditText:
      "Pulsa el botón de opciones de un contador para editar, duplicar, eliminar o cambiar rápidamente su tamaño. En móvil, estas acciones aparecen en un panel inferior que no queda cortado; en pantallas grandes, junto al contador. El editor permite cambiar nombre, valor inicial, color e icono, con buscador y categorías como superhéroes, fantasía o combate. Los tamaños XS, S, M y L modifican la distribución y el ancho, pero conservan una altura y tipografía coherentes.",
    helpChoasisTitle: "Choasis",
    helpChoasisText:
      "Choasis elige una persona al azar y ofrece dos modos según el número de jugadores y cómo queráis realizar la elección.",
    helpChoasisTouchTitle: "Modo táctil",
    helpChoasisTouchText:
      "Cada jugador coloca un dedo sobre la pantalla y Choasis selecciona uno de ellos. Este modo admite un máximo de 5 jugadores al mismo tiempo. Después de una elección, toca la pantalla para empezar otra.",
    helpChoasisManualTitle: "Modo manual",
    helpChoasisManualText:
      "Si sois más de 5, abre el menú de la barra de navegación y cambia al modo manual. Indica el número de participantes y pulsa «Elegir» para obtener un jugador al azar. El modo manual admite hasta 100 jugadores.",
    helpTimerText:
      "El temporizador permite preparar una cuenta atrás para turnos, rondas o cualquier fase de una partida.",
    helpTimerSetupTitle: "Configurar el tiempo",
    helpTimerSetupText:
      "Introduce los minutos y segundos antes de iniciar la cuenta atrás. Puedes configurar hasta 99 minutos y 59 segundos. En el primer acceso se muestran 30 segundos y, después, la aplicación recuerda el último tiempo que hayas configurado.",
    helpTimerControlsTitle: "Controles",
    helpTimerControlsText:
      "Pulsa «Iniciar» para comenzar. «Detener» pausa la cuenta atrás y permite continuar desde el mismo punto con «Reanudar». «Reiniciar» devuelve el temporizador al tiempo configurado para empezar de nuevo.",
    helpTimerFinishTitle: "Final de la cuenta atrás",
    helpTimerFinishText:
      "El anillo rojo va desapareciendo en sentido horario para mostrar visualmente el tiempo restante. Al llegar a cero, suena una alarma para avisarte de que el tiempo ha terminado.",
    timerTitle: "Temporizador",
    timerDescription:
      "Configura una cuenta atrás con progreso visual y aviso sonoro.",
    timerMinutes: "Minutos",
    timerSeconds: "Segundos",
    timerStart: "Iniciar",
    timerResume: "Reanudar",
    timerRestart: "Reiniciar",
    timerStop: "Detener",
    timerReady: "Temporizador preparado",
    timerRunning: "Cuenta atrás en curso",
    timerPaused: "Temporizador detenido",
    timerFinished: "¡Tiempo finalizado!",
    timerAriaLabel: "Tiempo restante",
    diceTitle: "Tiradados",
    diceDescription:
      "Añade dados o monedas, lánzalos juntos y consulta el resultado.",
    diceConfiguration: "Dados de la tirada",
    dicePicker: "Añadir a la tirada",
    diceAdd: "Añadir",
    diceRemove: "Quitar",
    diceEmptyTray: "Pulsa un dado o la moneda para añadirlo.",
    diceCoin: "Moneda",
    diceCoinShort: "M",
    diceHeads: "Cara",
    diceTails: "Cruz",
    diceHeadsShort: "C",
    diceTailsShort: "X",
    diceDecrease: "Quitar",
    diceIncrease: "Añadir",
    diceQuantity: "Cantidad de",
    diceRoll: "Lanzar",
    diceRolling: "Tirando...",
    diceEmptyResult: "Configura los dados y realiza una tirada.",
    diceResult: "Resultado",
    diceTotal: "Puntuación total",
    diceHistory: "Últimas tiradas",
    diceClearHistory: "Limpiar",
    diceResetConfiguration: "Vaciar bandeja",
    helpDiceText:
      "El tiradados permite combinar distintos tipos de dados y monedas, lanzarlos juntos y consultar cada resultado.",
    helpDiceSetupTitle: "Preparar los dados",
    helpDiceSetupText:
      "Pulsa los dados d4, d6, d8, d10, d12, d20, d100 o la moneda para añadirlos a la bandeja. Puedes combinarlos, tocar cualquier pieza para quitarla o usar «Vaciar bandeja» para retirar todas a la vez. La configuración se conservará para la próxima vez.",
    helpDiceRollTitle: "Lanzamiento y resultado",
    helpDiceRollText:
      "Pulsa «Lanzar» para tirar a la vez todos los dados y monedas de la bandeja. Al terminar verás cada resultado, las caras o cruces obtenidas y la suma total de los dados.",
    helpDiceHistoryTitle: "Últimas tiradas",
    helpDiceHistoryText:
      "La aplicación guarda las diez tiradas más recientes para que puedas consultar sus dados, monedas y resultados incluso después de cerrar o recargar la página.",
    scoreSheetTitle: "Hoja de puntuación",
    scoreSheetDescription:
      "Anota y suma los puntos de todos los jugadores en una tabla.",
    scoreSheetConcept: "Concepto",
    scoreSheetPlayer: "Jugador",
    scoreSheetScore: "Puntuación",
    scoreSheetTotal: "Total",
    scoreSheetAddConcept: "Añadir concepto",
    scoreSheetAddPlayer: "Añadir jugador",
    scoreSheetRemoveConcept: "Eliminar concepto",
    scoreSheetRemovePlayer: "Eliminar jugador",
    scoreSheetClearScores: "Limpiar puntuaciones",
    scoreSheetReset: "Restablecer tabla",
    scoreSheetClearHint: "Puedes limpiar las puntuaciones desde el menú.",
    scoreSheetMenuTitle: "Acciones de la hoja",
    scoreSheetMenuDescription:
      "Limpia solo las puntuaciones o restablece jugadores y conceptos.",
    scoreSheetWinner: "Mayor puntuación",
    scoreSheetCurrentWinner: "Ganador actual",
    scoreSheetTie: "Empate",
    scoreSheetWinnerUndecided: "Ganador por decidir",
    helpScoreSheetText:
      "La hoja de puntuación reúne en una tabla los puntos de todos los jugadores y calcula automáticamente el resultado de la partida.",
    helpScoreSheetStructureTitle: "Jugadores y conceptos",
    helpScoreSheetStructureText:
      "Cada jugador ocupa una columna y cada concepto de puntuación una fila. Usa el botón «+» al final de la cabecera para añadir jugadores y el botón «+» de la última fila para añadir conceptos. Puedes editar sus nombres directamente y eliminarlos con la papelera. Siempre debe quedar al menos un jugador y un concepto.",
    helpScoreSheetScoresTitle: "Puntuaciones y ganador",
    helpScoreSheetScoresText:
      "Introduce en cada celda los puntos del jugador para ese concepto. Se admiten valores positivos, negativos y decimales. La última fila muestra los totales y destaca en rojo al jugador con más puntos. Si hay empate, se resaltan todos los jugadores empatados.",
    helpScoreSheetStorageTitle: "Limpiar y reiniciar",
    helpScoreSheetStorageText:
      "Desde el menú puedes limpiar solo las puntuaciones, conservando jugadores y conceptos, o restablecer por completo la tabla, dejándola con un jugador y un concepto.",
    appTitle: "Companion",
    logoAlt: "Logo de Juernes de Mesa",
    barReset: "Reiniciar",
    barAddCounter: "Añadir",
    counterNewName: "Contador",
    navActions: "Opciones",
    close: "Cerrar",
    colorPickerAria: "Selector de color",
    iconPickerAria: "Selector de icono",
    iconSearchPlaceholder: "Buscar iconos",
    iconSearchEmpty: "No hay iconos que coincidan con la búsqueda.",
    iconCategoriesAria: "Categorías de iconos",
    iconCategory_favorites: "Esenciales",
    iconCategory_superheroes: "Superhéroes",
    iconCategory_fantasy: "Fantasía",
    iconCategory_combat: "Combate",
    iconCategory_nature: "Naturaleza",
    iconCategory_scifi: "Ciencia ficción",
    iconCategory_objects: "Objetos y juego",
    labelCounterSize: "Tamaño del contador",
    counterSizePreset_XS: "Compacto",
    counterSizePreset_S: "Pequeño",
    counterSizePreset_M: "Mediano",
    counterSizePreset_L: "Destacado",
    counterSizeLegend: "Número de contadores por fila en móvil, tablet y escritorio.",
    counterSizeCustom: "Distribución de la plantilla",
    counterSizeCustomHint: "Conservaremos esta distribución hasta que elijas otro preset.",
    deviceMobile: "Móvil",
    deviceTablet: "Tablet",
    deviceDesktop: "Escritorio",
    counterSizeHint_XS: "Compacto: hasta cuatro contadores por fila en pantallas grandes.",
    counterSizeHint_S: "Pequeño: pensado para marcadores secundarios.",
    counterSizeHint_M: "Mediano: dos contadores por fila en tablet y escritorio.",
    counterSizeHint_L: "Grande: ocupa toda la fila para un marcador protagonista.",
    templateLabel: "Plantilla",
    gameLabel: "Juego",
    distributionLabel: "Distribución",
    game_generic: "Genérico",
    game_marvel: "Marvel Champions",
    game_magic: "Magic: The Gathering",
    game_aeons: "Aeon's End",
    game_custom: "Personalizada",
    game_empty: "Vacía",
    template_custom: "Personalizada",
    template_empty: "Vacía",
    template_marvelSolo: "1 Jugador",
    template_marvelSoloCounters: "1 Jugador + recurso",
    template_marvel2P: "2 Jugadores",
    template_marvel3P: "3 Jugadores",
    template_marvel4P: "4 Jugadores",
    template_commander: "Commander",
    template_duel: "Duelo",
    template_lifeEnergy: "Vida/Energía",
    template_life1: "1 Jugador",
    template_life2: "2 Jugadores",
    template_life3: "3 Jugadores",
    template_life4: "4 Jugadores",
    template_life5: "5 Jugadores",
    template_life6: "6 Jugadores",
    counter_player: "Jugador",
    counter_hero: "Héroe",
    counter_villain: "Villano",
    counter_threat: "Amenaza",
    counter_resource: "Recurso",
    counter_life: "Vida",
    counter_energy: "Energía",
    template_aeons1P: "1 Jugador",
    template_aeons2P: "2 Jugadores",
    template_aeons3P: "3 Jugadores",
    template_aeons4P: "4 Jugadores",
    choasisTitle: "Choasis",
    choasisDescription:
      "Sirve para elegir jugador inicial o elegir a un jugador de entre todos.",
    choasisPlaceholder: "Pon tu dedo para comenzar la elección",
    choasisResetHint: "Toca para reiniciar",
    choasisToManual: "Modo manual",
    choasisToTouch: "Modo táctil",
    choasisManualTitle: "Modo manual",
    choasisManualPlayersLabel: "Número de jugadores",
    choasisManualRandomize: "Elegir",
    choasisManualResult: "Jugador",
    choasisMoreThanFive: "¿Más de 5?",
    choasisManualHintMenu: "Activa el modo manual en el menú",
    choasisMenuTitle: "Modo de elección",
    choasisMenuDescription:
      "Cambia entre la selección táctil y el sorteo por número de jugador.",
  },
  en: {
    homeTitle: "Your tabletop companion for game nights.",
    homeDescription:
      "Companion app with handy tools for board games — counters and more. Designed for quick, mobile use.",
    homeEyebrow: "Your table, always ready",
    homeContinue: "Continue",
    homeContinueHint: "Pick up exactly where you left off",
    homeFavorites: "Your favorites",
    homeFavoritesHint: "Choose up to four shortcuts and arrange them your way.",
    homeAllTools: "All tools",
    homeMore: "More",
    favoriteAdd: "Add to favorites",
    favoriteRemove: "Remove from favorites",
    favoriteReorder: "Reorder",
    favoriteReorderTitle: "Reorder favorites",
    favoriteReorderHint: "Drag from the handle to change their position in the bottom bar.",
    favoriteLimit: "Remove a favorite before adding another",
    navigationMenu: "Navigation menu",
    navigationPrimary: "Primary navigation",
    navigationHome: "Home",
    navigationTools: "Tools",
    navigationMore: "More",
    navigationBack: "Back",
    navToolActions: "Tool options",
    settingsTitle: "Settings",
    settingsDescription: "Customize the app appearance and language.",
    settingsAppearance: "Appearance",
    settingsLanguage: "App language",
    settingsTheme: "Visual theme",
    settingsAbout: "About",
    settingsVersion: "Version",
    settingsSaved: "Changes are saved automatically on this device.",
    installApp: "Install app",
    installAppHint: "Add it to your home screen to open it like an app.",
    installIosTitle: "Install on iPhone or iPad",
    installIosChromeDescription: "Chrome on iPhone cannot let the website open an installer automatically. You can add it from the Share menu.",
    installIosChromeStepShare: "Tap Share in Chrome.",
    installIosSafariDescription: "Safari does not show an automatic install button. You can add the app from its Share menu.",
    installIosSafariStepShare: "Tap Share in Safari.",
    installIosOtherDescription: "On iPhone or iPad, installation is available from your browser's sharing options.",
    installAndroidTitle: "Install on Android",
    installAndroidDescription: "If your browser does not show the automatic installer, you can add the app from its menu.",
    installAndroidStepMenu: "Open the browser menu.",
    installDesktopTitle: "Install on this device",
    installDesktopDescription: "If the automatic installer is unavailable, look for the installation option in your browser menu.",
    installDesktopStepMenu: "Open your browser options.",
    installGenericStepMenu: "Open Share or your browser options.",
    installGenericStepAdd: "Select “Add to Home Screen” or “Install app”.",
    installGenericFallback: "If the option is unavailable, open this page in another compatible browser or check your browser help.",
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
    menuDuplicate: "Duplicate",
    counterCopySuffix: "copy",
    menuDelete: "Delete",
    menuOptions: "Options",
    counterDecrement: "Decrease",
    counterIncrement: "Increase",
    emptyCounters: "There are no counters",
    emptyCountersHint:
      "Select a template or add a counter from the navigation menu.",
    emptyAddCounter: "Create counter",
    loadingCountersAria: "Loading counters",
    loadingCounters: "Loading counters...",
    loadingSoon: "It will not take long",
    footerAllRights: "All rights reserved.",
    feedbackLabel: "Send feedback",
    feedbackDescription: "Share suggestions, issues, or ideas to improve the app.",
    wakeLockLabel: "Keep screen awake",
    wakeLockShortLabel: "Keep awake",
    wakeLockActive: "Keep screen awake: on",
    wakeLockInactive: "Keep screen awake: off",
    wakeLockUnsupported: "This browser cannot keep the screen awake",
    helpTitle: "Help",
    helpDescription:
      "Learn how to navigate, customize, and install Companion, along with the features of each tool.",
    helpNavigationTitle: "Home and navigation",
    helpNavigationText:
      "Home brings together your shortcuts, the last tool you used, and the full catalog. On mobile, Home and your four favorites stay in the bottom bar; on larger screens they appear as tabs beside the logo.",
    helpNavigationFavoritesTitle: "Favorite tools",
    helpNavigationFavoritesText:
      "Select or clear a tool’s star to add or remove it. You can save up to four. Select “Reorder” on Home and drag each row by its handle to change the order in the bar and tabs.",
    helpNavigationMenuTitle: "Menu and back navigation",
    helpNavigationMenuText:
      "The hamburger button opens every tool and links to Settings, Help, and Feedback. Secondary screens also provide a back button, while each tool displays its own options on the right.",
    helpInstallTitle: "Install Companion",
    helpInstallText:
      "Under “More” on Home, select “Install app”. Once installed, Companion opens full screen and behaves like a standalone application.",
    helpInstallAutomaticTitle: "Automatic installation",
    helpInstallAutomaticText:
      "When supported, Companion opens the system installation prompt directly. Confirm it to add Companion to your apps.",
    helpInstallIosTitle: "iPhone, iPad, and other browsers",
    helpInstallIosText:
      "If no automatic installer appears, open Share or your browser menu and select “Add to Home Screen” or “Install app”. The displayed guide adapts to Chrome, Safari, Android, or desktop.",
    helpConfigTitle: "Settings",
    helpConfigText:
      "Language and theme are managed in Settings, which also displays the installed version. Keep awake remains in the navigation menu so you can change it during a game.",
    helpConfigOptionsTitle: "Available options",
    helpConfigLanguage:
      "Language: switch all app text between Spanish, English, and Italian.",
    helpConfigTheme:
      "Theme: choose light mode, dark mode, or follow your system appearance.",
    helpConfigWakeLock:
      "Keep awake: prevents your device from turning off the screen while you use the app. This is especially useful during a game with the counters. It is enabled on first use and remembers your latest choice.",
    helpConfigVersion:
      "About: displays the current Companion version.",
    helpCountersTitle: "Counters",
    helpCountersText:
      "The counters tool lets you prepare a scoreboard for each game and adjust it whenever needed.",
    helpCountersMenuTitle: "Templates and new counters",
    helpCountersMenuText:
      "Open the tool options in the top bar to choose a game and layout. A template creates the most common counters in one step. The same panel lets you reset their values or add a new counter.",
    helpCountersEditTitle: "Editing a counter",
    helpCountersEditText:
      "Select a counter’s options button to edit, duplicate, delete, or quickly resize it. On mobile, these actions appear in a bottom sheet that remains fully visible; on large screens, beside the counter. The editor lets you change its name, initial value, color, and icon, with search and categories such as superheroes, fantasy, and combat. XS, S, M, and L change the layout and width while retaining a consistent height and typography.",
    helpChoasisTitle: "Choasis",
    helpChoasisText:
      "Choasis picks one person at random and provides two modes depending on the number of players and how you want to make the choice.",
    helpChoasisTouchTitle: "Touch mode",
    helpChoasisTouchText:
      "Each player places one finger on the screen and Choasis selects one of them. This mode supports up to 5 players at the same time. After a selection, tap the screen to start again.",
    helpChoasisManualTitle: "Manual mode",
    helpChoasisManualText:
      "For more than 5 players, open the navigation bar menu and switch to manual mode. Enter the number of participants and select “Pick” to choose a player at random. Manual mode supports up to 100 players.",
    helpTimerText:
      "The timer provides a countdown for turns, rounds, or any other stage of a game.",
    helpTimerSetupTitle: "Setting the time",
    helpTimerSetupText:
      "Enter the minutes and seconds before starting the countdown. You can set up to 99 minutes and 59 seconds. The first visit starts at 30 seconds, and the app remembers the last duration you configured after that.",
    helpTimerControlsTitle: "Controls",
    helpTimerControlsText:
      "Select “Start” to begin. “Stop” pauses the countdown so you can continue from the same point with “Resume”. “Restart” returns the timer to the configured duration so you can start again.",
    helpTimerFinishTitle: "End of the countdown",
    helpTimerFinishText:
      "The red ring disappears clockwise to show the remaining time visually. When it reaches zero, an alarm lets you know that time is up.",
    timerTitle: "Timer",
    timerDescription:
      "Set a countdown with visual progress and an audible alert.",
    timerMinutes: "Minutes",
    timerSeconds: "Seconds",
    timerStart: "Start",
    timerResume: "Resume",
    timerRestart: "Restart",
    timerStop: "Stop",
    timerReady: "Timer ready",
    timerRunning: "Countdown in progress",
    timerPaused: "Timer stopped",
    timerFinished: "Time’s up!",
    timerAriaLabel: "Time remaining",
    diceTitle: "Dice roller",
    diceDescription:
      "Add dice or coins, roll them together, and see the result.",
    diceConfiguration: "Dice to roll",
    dicePicker: "Add to the roll",
    diceAdd: "Add",
    diceRemove: "Remove",
    diceEmptyTray: "Tap a die or the coin to add it.",
    diceCoin: "Coin",
    diceCoinShort: "C",
    diceHeads: "Heads",
    diceTails: "Tails",
    diceHeadsShort: "H",
    diceTailsShort: "T",
    diceDecrease: "Remove",
    diceIncrease: "Add",
    diceQuantity: "Number of",
    diceRoll: "Roll",
    diceRolling: "Rolling...",
    diceEmptyResult: "Configure your dice and make a roll.",
    diceResult: "Result",
    diceTotal: "Total score",
    diceHistory: "Recent rolls",
    diceClearHistory: "Clear",
    diceResetConfiguration: "Clear tray",
    helpDiceText:
      "The roller combines different dice and coins, rolls them together, and shows every result.",
    helpDiceSetupTitle: "Preparing the dice",
    helpDiceSetupText:
      "Tap a d4, d6, d8, d10, d12, d20, d100, or the coin to add it to the tray. Combine them freely, tap any item to remove it, or use “Clear tray” to remove everything at once. Your setup is remembered for next time.",
    helpDiceRollTitle: "Roll and result",
    helpDiceRollText:
      "Select “Roll” to throw every die and coin in the tray together. You will see every result, each heads or tails outcome, and the combined dice total.",
    helpDiceHistoryTitle: "Recent rolls",
    helpDiceHistoryText:
      "The app saves the ten most recent rolls so you can review their dice, coins, and results after closing or reloading the page.",
    scoreSheetTitle: "Score sheet",
    scoreSheetDescription:
      "Record and total every player’s points in a table.",
    scoreSheetConcept: "Category",
    scoreSheetPlayer: "Player",
    scoreSheetScore: "Score",
    scoreSheetTotal: "Total",
    scoreSheetAddConcept: "Add category",
    scoreSheetAddPlayer: "Add player",
    scoreSheetRemoveConcept: "Remove category",
    scoreSheetRemovePlayer: "Remove player",
    scoreSheetClearScores: "Clear scores",
    scoreSheetReset: "Reset table",
    scoreSheetClearHint: "You can clear the scores from the menu.",
    scoreSheetMenuTitle: "Sheet actions",
    scoreSheetMenuDescription:
      "Clear scores only, or reset players and scoring categories.",
    scoreSheetWinner: "Highest score",
    scoreSheetCurrentWinner: "Current winner",
    scoreSheetTie: "Tie",
    scoreSheetWinnerUndecided: "Winner to be decided",
    helpScoreSheetText:
      "The score sheet keeps every player’s points in one table and calculates the game result automatically.",
    helpScoreSheetStructureTitle: "Players and categories",
    helpScoreSheetStructureText:
      "Each player uses one column and each scoring category uses one row. Use the “+” button at the end of the header to add players and the “+” button in the last row to add categories. You can edit their names directly and remove them with the bin. At least one player and one category must always remain.",
    helpScoreSheetScoresTitle: "Scores and winner",
    helpScoreSheetScoresText:
      "Enter each player’s points for a category in the corresponding cell. Positive, negative, and decimal values are supported. The final row shows the totals and highlights the player with the highest score in red. If there is a tie, every tied player is highlighted.",
    helpScoreSheetStorageTitle: "Clearing and resetting",
    helpScoreSheetStorageText:
      "From the menu, you can clear only the scores while keeping the players and categories, or reset the entire table to one player and one category.",
    appTitle: "Companion",
    logoAlt: "Juernes de Mesa logo",
    barReset: "Reset",
    barAddCounter: "Add",
    counterNewName: "Counter",
    navActions: "Options",
    close: "Close",
    colorPickerAria: "Color Picker",
    iconPickerAria: "Icon Picker",
    iconSearchPlaceholder: "Search icons",
    iconSearchEmpty: "No icons match your search.",
    iconCategoriesAria: "Icon categories",
    iconCategory_favorites: "Essentials",
    iconCategory_superheroes: "Superheroes",
    iconCategory_fantasy: "Fantasy",
    iconCategory_combat: "Combat",
    iconCategory_nature: "Nature",
    iconCategory_scifi: "Sci-fi",
    iconCategory_objects: "Objects & games",
    labelCounterSize: "Counter size",
    counterSizePreset_XS: "Compact",
    counterSizePreset_S: "Small",
    counterSizePreset_M: "Medium",
    counterSizePreset_L: "Featured",
    counterSizeLegend: "Counters per row on mobile, tablet, and desktop.",
    counterSizeCustom: "Template layout",
    counterSizeCustomHint: "This layout is preserved until you choose another preset.",
    deviceMobile: "Mobile",
    deviceTablet: "Tablet",
    deviceDesktop: "Desktop",
    counterSizeHint_XS: "Compact: up to four counters per row on large screens.",
    counterSizeHint_S: "Small: designed for secondary trackers.",
    counterSizeHint_M: "Medium: two counters per row on tablets and desktops.",
    counterSizeHint_L: "Large: fills the row for a primary tracker.",
    templateLabel: "Template",
    gameLabel: "Game",
    distributionLabel: "Distribution",
    game_generic: "Generic",
    game_marvel: "Marvel Champions",
    game_magic: "Magic: The Gathering",
    game_aeons: "Aeon's End",
    game_custom: "Custom",
    game_empty: "Empty",
    template_custom: "Custom",
    template_empty: "Empty",
    template_marvelSolo: "1 Player",
    template_marvelSoloCounters: "1 Player + resource",
    template_marvel2P: "2 Players",
    template_marvel3P: "3 Players",
    template_marvel4P: "4 Players",
    template_commander: "Commander",
    template_duel: "Duel",
    template_lifeEnergy: "Life/Energy",
    template_life1: "1 Player",
    template_life2: "2 Players",
    template_life3: "3 Players",
    template_life4: "4 Players",
    template_life5: "5 Players",
    template_life6: "6 Players",
    counter_player: "Player",
    counter_hero: "Hero",
    counter_villain: "Villain",
    counter_threat: "Threat",
    counter_resource: "Resource",
    counter_life: "Life",
    counter_energy: "Energy",
    template_aeons1P: "1 Player",
    template_aeons2P: "2 Players",
    template_aeons3P: "3 Players",
    template_aeons4P: "4 Players",
    choasisTitle: "Choasis",
    choasisDescription:
      "Pick the starting player or choose one from all players.",
    choasisPlaceholder: "Place your finger to start",
    choasisResetHint: "Tap to reset",
    choasisToManual: "Manual mode",
    choasisToTouch: "Touch mode",
    choasisManualTitle: "Manual mode",
    choasisManualPlayersLabel: "Number of players",
    choasisManualRandomize: "Pick",
    choasisManualResult: "Player",
    choasisMoreThanFive: "More than 5?",
    choasisManualHintMenu: "Enable manual mode from the menu",
    choasisMenuTitle: "Selection mode",
    choasisMenuDescription:
      "Switch between touch selection and a draw by player number.",
  },
  it: {
    homeTitle: "La tua compagna di gioco al tavolo.",
    homeDescription:
      "App companion con utilità per i giochi da tavolo: contatori e altro. Progettata per l’uso mobile e rapido.",
    homeEyebrow: "Il tuo tavolo, sempre pronto",
    homeContinue: "Continua",
    homeContinueHint: "Riprendi esattamente da dove avevi lasciato",
    homeFavorites: "I tuoi preferiti",
    homeFavoritesHint: "Scegli fino a quattro scorciatoie e disponile come preferisci.",
    homeAllTools: "Tutti gli strumenti",
    homeMore: "Altro",
    favoriteAdd: "Aggiungi ai preferiti",
    favoriteRemove: "Rimuovi dai preferiti",
    favoriteReorder: "Riordina",
    favoriteReorderTitle: "Riordina i preferiti",
    favoriteReorderHint: "Trascina dalla maniglia per cambiare la posizione nella barra inferiore.",
    favoriteLimit: "Rimuovi un preferito prima di aggiungerne un altro",
    navigationMenu: "Menu di navigazione",
    navigationPrimary: "Navigazione principale",
    navigationHome: "Home",
    navigationTools: "Strumenti",
    navigationMore: "Altro",
    navigationBack: "Indietro",
    navToolActions: "Opzioni dello strumento",
    settingsTitle: "Impostazioni",
    settingsDescription: "Personalizza l’aspetto e la lingua dell’app.",
    settingsAppearance: "Aspetto",
    settingsLanguage: "Lingua dell’app",
    settingsTheme: "Tema visivo",
    settingsAbout: "Informazioni",
    settingsVersion: "Versione",
    settingsSaved: "Le modifiche vengono salvate automaticamente su questo dispositivo.",
    installApp: "Installa l’app",
    installAppHint: "Aggiungila alla schermata Home per aprirla come un’app.",
    installIosTitle: "Installa su iPhone o iPad",
    installIosChromeDescription: "Chrome su iPhone non consente al sito di aprire automaticamente il programma di installazione. Puoi aggiungere l’app dal menu Condividi.",
    installIosChromeStepShare: "Tocca Condividi in Chrome.",
    installIosSafariDescription: "Safari non mostra un pulsante di installazione automatico. Puoi aggiungere l’app dal menu Condividi.",
    installIosSafariStepShare: "Tocca Condividi in Safari.",
    installIosOtherDescription: "Su iPhone o iPad, l’installazione è disponibile dalle opzioni di condivisione del browser.",
    installAndroidTitle: "Installa su Android",
    installAndroidDescription: "Se il browser non mostra l’installazione automatica, puoi aggiungere l’app dal suo menu.",
    installAndroidStepMenu: "Apri il menu del browser.",
    installDesktopTitle: "Installa su questo dispositivo",
    installDesktopDescription: "Se l’installazione automatica non è disponibile, cerca l’opzione di installazione nel menu del browser.",
    installDesktopStepMenu: "Apri le opzioni del browser.",
    installGenericStepMenu: "Apri Condividi o le opzioni del browser.",
    installGenericStepAdd: "Seleziona «Aggiungi alla schermata Home» o «Installa app».",
    installGenericFallback: "Se l’opzione non è disponibile, apri questa pagina in un altro browser compatibile o consulta la guida del browser.",
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
    menuDuplicate: "Duplica",
    counterCopySuffix: "copia",
    menuDelete: "Elimina",
    menuOptions: "Opzioni",
    counterDecrement: "Sottrai da",
    counterIncrement: "Aggiungi a",
    emptyCounters: "Non ci sono contatori",
    emptyCountersHint:
      "Seleziona un modello o aggiungi un contatore dal menu di navigazione.",
    emptyAddCounter: "Crea contatore",
    loadingCountersAria: "Caricamento contatori",
    loadingCounters: "Caricamento contatori...",
    loadingSoon: "Non ci vorrà molto",
    footerAllRights: "Tutti i diritti riservati.",
    feedbackLabel: "Invia feedback",
    feedbackDescription: "Condividi suggerimenti, problemi o idee per migliorare l'app.",
    wakeLockLabel: "Mantieni lo schermo acceso",
    wakeLockShortLabel: "Schermo acceso",
    wakeLockActive: "Schermo sempre acceso: attivato",
    wakeLockInactive: "Schermo sempre acceso: disattivato",
    wakeLockUnsupported: "Questo browser non può mantenere lo schermo acceso",
    helpTitle: "Aiuto",
    helpDescription:
      "Scopri come navigare, personalizzare e installare Companion, oltre alle funzioni di ogni strumento.",
    helpNavigationTitle: "Home e navigazione",
    helpNavigationText:
      "La Home riunisce gli accessi rapidi, l’ultimo strumento utilizzato e il catalogo completo. Su mobile, Home e i quattro preferiti restano nella barra inferiore; sugli schermi più grandi appaiono come schede accanto al logo.",
    helpNavigationFavoritesTitle: "Strumenti preferiti",
    helpNavigationFavoritesText:
      "Seleziona o deseleziona la stella di uno strumento per aggiungerlo o rimuoverlo. Puoi salvarne fino a quattro. Premi «Riordina» nella Home e trascina ogni riga dalla maniglia per cambiare l’ordine nella barra e nelle schede.",
    helpNavigationMenuTitle: "Menu e navigazione indietro",
    helpNavigationMenuText:
      "Il pulsante hamburger apre tutti gli strumenti e i collegamenti a Impostazioni, Aiuto e Feedback. Le schermate secondarie includono anche un pulsante Indietro; ogni strumento mostra le proprie opzioni sulla destra.",
    helpInstallTitle: "Installare Companion",
    helpInstallText:
      "Nella sezione «Altro» della Home, premi «Installa l’app». Una volta installata, Companion si apre a schermo intero e funziona come un’applicazione indipendente.",
    helpInstallAutomaticTitle: "Installazione automatica",
    helpInstallAutomaticText:
      "Quando il browser lo consente, Companion apre direttamente la finestra di installazione del sistema. Conferma per aggiungerla alle applicazioni.",
    helpInstallIosTitle: "iPhone, iPad e altri browser",
    helpInstallIosText:
      "Se non appare l’installazione automatica, apri Condividi o il menu del browser e scegli «Aggiungi alla schermata Home» o «Installa app». La guida mostrata si adatta a Chrome, Safari, Android o desktop.",
    helpConfigTitle: "Impostazioni",
    helpConfigText:
      "Lingua e tema si gestiscono nelle Impostazioni, dove viene mostrata anche la versione installata. Il controllo per mantenere lo schermo acceso resta nel menu di navigazione, così puoi cambiarlo durante una partita.",
    helpConfigOptionsTitle: "Opzioni disponibili",
    helpConfigLanguage:
      "Lingua: cambia tutti i testi dell’app tra spagnolo, inglese e italiano.",
    helpConfigTheme:
      "Tema: scegli la modalità chiara, quella scura oppure l’aspetto configurato nel sistema.",
    helpConfigWakeLock:
      "Schermo acceso: impedisce al dispositivo di spegnere lo schermo mentre usi l’app. È particolarmente utile durante una partita con i contatori. L’opzione è attiva al primo utilizzo e ricorda l’ultima scelta.",
    helpConfigVersion:
      "Informazioni: mostra la versione attuale di Companion.",
    helpCountersTitle: "Counters",
    helpCountersText:
      "Lo strumento dei contatori ti permette di preparare un segnapunti adatto a ogni partita e modificarlo quando necessario.",
    helpCountersMenuTitle: "Modelli e nuovi contatori",
    helpCountersMenuText:
      "Apri le opzioni dello strumento nella barra superiore per scegliere un gioco e una disposizione. Un modello crea in un solo passaggio i contatori più comuni. Dallo stesso pannello puoi azzerare i valori o aggiungere un nuovo contatore.",
    helpCountersEditTitle: "Modificare un contatore",
    helpCountersEditText:
      "Premi il pulsante delle opzioni di un contatore per modificarlo, duplicarlo, eliminarlo o ridimensionarlo rapidamente. Su mobile, queste azioni appaiono in un pannello inferiore sempre visibile; sugli schermi grandi, accanto al contatore. L’editor permette di cambiare nome, valore iniziale, colore e icona, con ricerca e categorie come supereroi, fantasy e combattimento. Le dimensioni XS, S, M e L cambiano disposizione e larghezza mantenendo coerenti altezza e tipografia.",
    helpChoasisTitle: "Choasis",
    helpChoasisText:
      "Choasis sceglie una persona a caso e offre due modalità in base al numero di giocatori e a come volete effettuare la scelta.",
    helpChoasisTouchTitle: "Modalità touch",
    helpChoasisTouchText:
      "Ogni giocatore appoggia un dito sullo schermo e Choasis ne seleziona uno. Questa modalità supporta fino a 5 giocatori contemporaneamente. Dopo una scelta, tocca lo schermo per ricominciare.",
    helpChoasisManualTitle: "Modalità manuale",
    helpChoasisManualText:
      "Se siete più di 5, apri il menu della barra di navigazione e passa alla modalità manuale. Inserisci il numero di partecipanti e premi «Scegli» per selezionare un giocatore a caso. La modalità manuale supporta fino a 100 giocatori.",
    helpTimerText:
      "Il timer permette di preparare un conto alla rovescia per turni, round o qualsiasi altra fase di una partita.",
    helpTimerSetupTitle: "Impostare il tempo",
    helpTimerSetupText:
      "Inserisci i minuti e i secondi prima di avviare il conto alla rovescia. Puoi impostare fino a 99 minuti e 59 secondi. Al primo accesso vengono mostrati 30 secondi; in seguito, l’app ricorda l’ultima durata configurata.",
    helpTimerControlsTitle: "Controlli",
    helpTimerControlsText:
      "Premi «Avvia» per iniziare. «Ferma» mette in pausa il conto alla rovescia e permette di continuare dallo stesso punto con «Riprendi». «Ricomincia» riporta il timer alla durata configurata per iniziare di nuovo.",
    helpTimerFinishTitle: "Fine del conto alla rovescia",
    helpTimerFinishText:
      "L’anello rosso scompare in senso orario per mostrare visivamente il tempo rimanente. Quando arriva a zero, un allarme ti avvisa che il tempo è scaduto.",
    timerTitle: "Timer",
    timerDescription:
      "Imposta un conto alla rovescia con progresso visivo e avviso sonoro.",
    timerMinutes: "Minuti",
    timerSeconds: "Secondi",
    timerStart: "Avvia",
    timerResume: "Riprendi",
    timerRestart: "Ricomincia",
    timerStop: "Ferma",
    timerReady: "Timer pronto",
    timerRunning: "Conto alla rovescia in corso",
    timerPaused: "Timer fermo",
    timerFinished: "Tempo scaduto!",
    timerAriaLabel: "Tempo rimanente",
    diceTitle: "Lancia dadi",
    diceDescription:
      "Aggiungi dadi o monete, lanciali insieme e consulta il risultato.",
    diceConfiguration: "Dadi da lanciare",
    dicePicker: "Aggiungi al lancio",
    diceAdd: "Aggiungi",
    diceRemove: "Rimuovi",
    diceEmptyTray: "Tocca un dado o la moneta per aggiungerlo.",
    diceCoin: "Moneta",
    diceCoinShort: "M",
    diceHeads: "Testa",
    diceTails: "Croce",
    diceHeadsShort: "T",
    diceTailsShort: "C",
    diceDecrease: "Rimuovi",
    diceIncrease: "Aggiungi",
    diceQuantity: "Quantità di",
    diceRoll: "Lancia",
    diceRolling: "Lancio in corso...",
    diceEmptyResult: "Configura i dadi ed effettua un lancio.",
    diceResult: "Risultato",
    diceTotal: "Punteggio totale",
    diceHistory: "Lanci recenti",
    diceClearHistory: "Cancella",
    diceResetConfiguration: "Svuota vassoio",
    helpDiceText:
      "Il lanciadadi permette di combinare dadi e monete, lanciarli insieme e consultare ogni risultato.",
    helpDiceSetupTitle: "Preparare i dadi",
    helpDiceSetupText:
      "Tocca un d4, d6, d8, d10, d12, d20, d100 o la moneta per aggiungerlo al vassoio. Puoi combinarli, toccare qualsiasi elemento per rimuoverlo o usare «Svuota vassoio» per rimuoverli tutti insieme. La configurazione viene ricordata.",
    helpDiceRollTitle: "Lancio e risultato",
    helpDiceRollText:
      "Premi «Lancia» per tirare insieme tutti i dadi e le monete nel vassoio. Vedrai ogni risultato, testa o croce, e la somma totale dei dadi.",
    helpDiceHistoryTitle: "Lanci recenti",
    helpDiceHistoryText:
      "L’app salva gli ultimi dieci lanci, così puoi consultarne dadi, monete e risultati anche dopo aver chiuso o ricaricato la pagina.",
    scoreSheetTitle: "Foglio segnapunti",
    scoreSheetDescription:
      "Annota e somma in una tabella i punti di tutti i giocatori.",
    scoreSheetConcept: "Voce",
    scoreSheetPlayer: "Giocatore",
    scoreSheetScore: "Punteggio",
    scoreSheetTotal: "Totale",
    scoreSheetAddConcept: "Aggiungi voce",
    scoreSheetAddPlayer: "Aggiungi giocatore",
    scoreSheetRemoveConcept: "Elimina voce",
    scoreSheetRemovePlayer: "Elimina giocatore",
    scoreSheetClearScores: "Cancella punteggi",
    scoreSheetReset: "Reimposta tabella",
    scoreSheetClearHint: "Puoi cancellare i punteggi dal menu.",
    scoreSheetMenuTitle: "Azioni del foglio",
    scoreSheetMenuDescription:
      "Cancella solo i punteggi oppure reimposta giocatori e voci.",
    scoreSheetWinner: "Punteggio più alto",
    scoreSheetCurrentWinner: "Vincitore attuale",
    scoreSheetTie: "Pareggio",
    scoreSheetWinnerUndecided: "Vincitore da decidere",
    helpScoreSheetText:
      "Il foglio segnapunti raccoglie in una tabella i punti di tutti i giocatori e calcola automaticamente il risultato della partita.",
    helpScoreSheetStructureTitle: "Giocatori e voci",
    helpScoreSheetStructureText:
      "Ogni giocatore occupa una colonna e ogni voce di punteggio una riga. Usa il pulsante «+» alla fine dell’intestazione per aggiungere giocatori e il pulsante «+» dell’ultima riga per aggiungere voci. Puoi modificarne direttamente i nomi ed eliminarli con il cestino. Deve sempre rimanere almeno un giocatore e una voce.",
    helpScoreSheetScoresTitle: "Punteggi e vincitore",
    helpScoreSheetScoresText:
      "Inserisci in ogni cella i punti del giocatore per quella voce. Sono ammessi valori positivi, negativi e decimali. L’ultima riga mostra i totali ed evidenzia in rosso il giocatore con il punteggio più alto. In caso di pareggio, vengono evidenziati tutti i giocatori a pari merito.",
    helpScoreSheetStorageTitle: "Cancellare e reimpostare",
    helpScoreSheetStorageText:
      "Dal menu puoi cancellare solo i punteggi, mantenendo giocatori e voci, oppure reimpostare l’intera tabella lasciando un giocatore e una voce.",
    appTitle: "Companion",
    logoAlt: "Logo di Juernes de Mesa",
    barReset: "Reimposta",
    barAddCounter: "Aggiungi",
    counterNewName: "Contatore",
    navActions: "Opzioni",
    close: "Chiudi",
    colorPickerAria: "Selettore colore",
    iconPickerAria: "Selettore icone",
    iconSearchPlaceholder: "Cerca icone",
    iconSearchEmpty: "Nessuna icona corrisponde alla ricerca.",
    iconCategoriesAria: "Categorie di icone",
    iconCategory_favorites: "Essenziali",
    iconCategory_superheroes: "Supereroi",
    iconCategory_fantasy: "Fantasy",
    iconCategory_combat: "Combattimento",
    iconCategory_nature: "Natura",
    iconCategory_scifi: "Fantascienza",
    iconCategory_objects: "Oggetti e gioco",
    labelCounterSize: "Dimensione contatore",
    counterSizePreset_XS: "Compatto",
    counterSizePreset_S: "Piccolo",
    counterSizePreset_M: "Medio",
    counterSizePreset_L: "In evidenza",
    counterSizeLegend: "Contatori per riga su mobile, tablet e desktop.",
    counterSizeCustom: "Disposizione del modello",
    counterSizeCustomHint: "Questa disposizione viene mantenuta finché non scegli un altro preset.",
    deviceMobile: "Mobile",
    deviceTablet: "Tablet",
    deviceDesktop: "Desktop",
    counterSizeHint_XS: "Compatto: fino a quattro contatori per riga su schermi grandi.",
    counterSizeHint_S: "Piccolo: pensato per i segnalini secondari.",
    counterSizeHint_M: "Medio: due contatori per riga su tablet e desktop.",
    counterSizeHint_L: "Grande: occupa tutta la riga per il contatore principale.",
    templateLabel: "Modello",
    gameLabel: "Gioco",
    distributionLabel: "Distribuzione",
    game_generic: "Generico",
    game_marvel: "Marvel Champions",
    game_magic: "Magic: The Gathering",
    game_aeons: "Aeon's End",
    game_custom: "Personalizzata",
    game_empty: "Vuota",
    template_custom: "Personalizzata",
    template_empty: "Vuota",
    template_marvelSolo: "1 Giocatore",
    template_marvelSoloCounters: "1 Giocatore + risorsa",
    template_marvel2P: "2 Giocatori",
    template_marvel3P: "3 Giocatori",
    template_marvel4P: "4 Giocatori",
    template_commander: "Commander",
    template_duel: "Duello",
    template_lifeEnergy: "Vita/Energia",
    template_life1: "1 Giocatore",
    template_life2: "2 Giocatori",
    template_life3: "3 Giocatori",
    template_life4: "4 Giocatori",
    template_life5: "5 Giocatori",
    template_life6: "6 Giocatori",
    counter_player: "Giocatore",
    counter_hero: "Eroe",
    counter_villain: "Cattivo",
    counter_threat: "Minaccia",
    counter_resource: "Risorsa",
    counter_life: "Vita",
    counter_energy: "Energia",
    template_aeons1P: "1 Giocatore",
    template_aeons2P: "2 Giocatori",
    template_aeons3P: "3 Giocatori",
    template_aeons4P: "4 Giocatori",
    choasisTitle: "Choasis",
    choasisDescription:
      "Serve per scegliere il giocatore iniziale o uno tra tutti.",
    choasisPlaceholder: "Appoggia il dito per iniziare",
    choasisResetHint: "Tocca per reimpostare",
    choasisToManual: "Modalità manuale",
    choasisToTouch: "Modalità touch",
    choasisManualTitle: "Modalità manuale",
    choasisManualPlayersLabel: "Numero di giocatori",
    choasisManualRandomize: "Scegli",
    choasisManualResult: "Giocatore",
    choasisMoreThanFive: "Più di 5?",
    choasisManualHintMenu: "Attiva la modalità manuale dal menu",
    choasisMenuTitle: "Modalità di scelta",
    choasisMenuDescription:
      "Passa dalla selezione touch all’estrazione per numero di giocatore.",
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
