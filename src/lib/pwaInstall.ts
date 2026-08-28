export type InstallGuide =
  | "ios-safari"
  | "ios-chrome"
  | "ios-other"
  | "android"
  | "desktop";

type NavigatorLike = Pick<Navigator, "userAgent" | "platform" | "maxTouchPoints">;

export function detectInstallGuide(navigatorValue: NavigatorLike): InstallGuide {
  const userAgent = navigatorValue.userAgent;
  const isIPadDesktopMode =
    navigatorValue.platform === "MacIntel" && navigatorValue.maxTouchPoints > 1;
  const isIos = /iPad|iPhone|iPod/i.test(userAgent) || isIPadDesktopMode;

  if (isIos) {
    if (/CriOS/i.test(userAgent)) return "ios-chrome";
    if (/Safari/i.test(userAgent) && !/FxiOS|EdgiOS|OPiOS/i.test(userAgent)) {
      return "ios-safari";
    }
    return "ios-other";
  }

  if (/Android/i.test(userAgent)) return "android";
  return "desktop";
}

export function isRunningStandalone(
  navigatorValue: NavigatorLike & { standalone?: boolean },
  matchesStandaloneDisplayMode: boolean,
) {
  return matchesStandaloneDisplayMode || navigatorValue.standalone === true;
}
