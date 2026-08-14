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
    counterDecrement: "Restar a",
    counterIncrement: "Sumar a",
    emptyCounters: "No hay contadores",
    emptyCountersHint:
      "Selecciona una plantilla o añade un contador desde el menú de navegación.",
    loadingCountersAria: "Cargando contadores",
    loadingCounters: "Cargando contadores...",
    loadingSoon: "No tardará mucho",
    footerAllRights: "Todos los derechos reservados.",
    wakeLockLabel: "Mantener la pantalla encendida",
    wakeLockShortLabel: "Pantalla siempre activa",
    wakeLockActive: "Pantalla siempre encendida: activada",
    wakeLockInactive: "Pantalla siempre encendida: desactivada",
    wakeLockUnsupported:
      "Este navegador no permite mantener la pantalla encendida",
    helpTitle: "Ayuda",
    helpDescription:
      "Esta guía resume las funciones principales de la aplicación y dónde encontrar cada opción.",
    helpConfigTitle: "Configuración",
    helpConfigText:
      "Las preferencias generales están siempre disponibles en el footer, tanto en la página principal como dentro de cada herramienta.",
    helpConfigOptionsTitle: "Opciones disponibles",
    helpConfigLanguage:
      "Idioma: cambia todos los textos de la aplicación entre español, inglés e italiano.",
    helpConfigTheme:
      "Tema: elige entre el modo claro, el modo oscuro o el aspecto configurado en tu sistema.",
    helpConfigWakeLock:
      "Pantalla siempre activa: evita que el dispositivo apague la pantalla mientras estás usando la aplicación. Resulta especialmente útil durante una partida con los contadores. La opción está activada la primera vez y recuerda el último valor elegido.",
    helpCountersTitle: "Counters",
    helpCountersText:
      "La herramienta de contadores permite preparar un marcador adaptado a cada partida y modificarlo cuando lo necesites.",
    helpCountersMenuTitle: "Plantillas y nuevos contadores",
    helpCountersMenuText:
      "Abre el menú de la barra de navegación para elegir un juego y una de sus plantillas. Una plantilla crea de una vez los contadores y la distribución más habituales para ese tipo de partida. Desde el mismo menú también puedes reiniciar la partida o añadir un contador nuevo. En pantallas pequeñas, estas opciones están contraídas bajo el botón de tres puntos.",
    helpCountersEditTitle: "Editar un contador",
    helpCountersEditText:
      "Pulsa la rueda dentada de un contador para abrir sus opciones. Desde allí puedes cambiar su nombre, el valor inicial, el color, el icono y el espacio que ocupa en cada tamaño de pantalla. También puedes eliminarlo si ya no lo necesitas.",
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
    close: "Cerrar",
    colorPickerAria: "Selector de color",
    iconPickerAria: "Selector de icono",
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
    counterDecrement: "Decrease",
    counterIncrement: "Increase",
    emptyCounters: "There are no counters",
    emptyCountersHint:
      "Select a template or add a counter from the navigation menu.",
    loadingCountersAria: "Loading counters",
    loadingCounters: "Loading counters...",
    loadingSoon: "It will not take long",
    footerAllRights: "All rights reserved.",
    wakeLockLabel: "Keep screen awake",
    wakeLockShortLabel: "Keep awake",
    wakeLockActive: "Keep screen awake: on",
    wakeLockInactive: "Keep screen awake: off",
    wakeLockUnsupported: "This browser cannot keep the screen awake",
    helpTitle: "Help",
    helpDescription:
      "This guide covers the app’s main features and where to find each option.",
    helpConfigTitle: "Settings",
    helpConfigText:
      "General preferences are always available in the footer, both on the home page and inside each tool.",
    helpConfigOptionsTitle: "Available options",
    helpConfigLanguage:
      "Language: switch all app text between Spanish, English, and Italian.",
    helpConfigTheme:
      "Theme: choose light mode, dark mode, or follow your system appearance.",
    helpConfigWakeLock:
      "Keep awake: prevents your device from turning off the screen while you use the app. This is especially useful during a game with the counters. It is enabled on first use and remembers your latest choice.",
    helpCountersTitle: "Counters",
    helpCountersText:
      "The counters tool lets you prepare a scoreboard for each game and adjust it whenever needed.",
    helpCountersMenuTitle: "Templates and new counters",
    helpCountersMenuText:
      "Open the navigation bar menu to choose a game and one of its templates. A template creates the counters and layout commonly used for that kind of game in one step. The same menu also lets you reset the game or add a new counter. On smaller screens, these options are collapsed under the three-dot button.",
    helpCountersEditTitle: "Editing a counter",
    helpCountersEditText:
      "Select the gear on a counter to open its options. From there, you can change its name, initial value, color, icon, and how much space it uses at each screen size. You can also delete it when it is no longer needed.",
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
    close: "Close",
    colorPickerAria: "Color Picker",
    iconPickerAria: "Icon Picker",
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
    counterDecrement: "Sottrai da",
    counterIncrement: "Aggiungi a",
    emptyCounters: "Non ci sono contatori",
    emptyCountersHint:
      "Seleziona un modello o aggiungi un contatore dal menu di navigazione.",
    loadingCountersAria: "Caricamento contatori",
    loadingCounters: "Caricamento contatori...",
    loadingSoon: "Non ci vorrà molto",
    footerAllRights: "Tutti i diritti riservati.",
    wakeLockLabel: "Mantieni lo schermo acceso",
    wakeLockShortLabel: "Schermo acceso",
    wakeLockActive: "Schermo sempre acceso: attivato",
    wakeLockInactive: "Schermo sempre acceso: disattivato",
    wakeLockUnsupported: "Questo browser non può mantenere lo schermo acceso",
    helpTitle: "Aiuto",
    helpDescription:
      "Questa guida riassume le funzioni principali dell’app e dove trovare ogni opzione.",
    helpConfigTitle: "Impostazioni",
    helpConfigText:
      "Le preferenze generali sono sempre disponibili nel footer, sia nella pagina iniziale sia all’interno di ogni strumento.",
    helpConfigOptionsTitle: "Opzioni disponibili",
    helpConfigLanguage:
      "Lingua: cambia tutti i testi dell’app tra spagnolo, inglese e italiano.",
    helpConfigTheme:
      "Tema: scegli la modalità chiara, quella scura oppure l’aspetto configurato nel sistema.",
    helpConfigWakeLock:
      "Schermo acceso: impedisce al dispositivo di spegnere lo schermo mentre usi l’app. È particolarmente utile durante una partita con i contatori. L’opzione è attiva al primo utilizzo e ricorda l’ultima scelta.",
    helpCountersTitle: "Counters",
    helpCountersText:
      "Lo strumento dei contatori ti permette di preparare un segnapunti adatto a ogni partita e modificarlo quando necessario.",
    helpCountersMenuTitle: "Modelli e nuovi contatori",
    helpCountersMenuText:
      "Apri il menu della barra di navigazione per scegliere un gioco e uno dei suoi modelli. Un modello crea in un solo passaggio i contatori e la disposizione più comuni per quel tipo di partita. Dallo stesso menu puoi anche azzerare la partita o aggiungere un nuovo contatore. Sugli schermi più piccoli, queste opzioni sono raccolte nel pulsante con i tre puntini.",
    helpCountersEditTitle: "Modificare un contatore",
    helpCountersEditText:
      "Premi l’ingranaggio di un contatore per aprire le sue opzioni. Da lì puoi cambiarne il nome, il valore iniziale, il colore, l’icona e lo spazio occupato per ogni dimensione dello schermo. Puoi anche eliminarlo quando non serve più.",
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
    close: "Chiudi",
    colorPickerAria: "Selettore colore",
    iconPickerAria: "Selettore icone",
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
