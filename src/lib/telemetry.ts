import { ApplicationInsights } from "@microsoft/applicationinsights-web";

type TelemetryProperties = Record<string, string | number | boolean | null | undefined>;
type TelemetryMeasurements = Record<string, number>;

let applicationInsights: ApplicationInsights | null = null;
let initializationAttempted = false;

const normalizeProperties = (properties: TelemetryProperties = {}) =>
  Object.fromEntries(
    Object.entries(properties)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)]),
  );

export const initializeTelemetry = () => {
  if (typeof window === "undefined" || initializationAttempted) {
    return applicationInsights;
  }

  initializationAttempted = true;
  const connectionString =
    process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING?.trim();
  if (!connectionString) return null;

  applicationInsights = new ApplicationInsights({
    config: {
      connectionString,
      enableAutoRouteTracking: false,
      enableCorsCorrelation: false,
      disableFetchTracking: false,
      disableAjaxTracking: false,
      disableExceptionTracking: false,
      autoTrackPageVisitTime: true,
    },
  });
  applicationInsights.loadAppInsights();
  applicationInsights.addTelemetryInitializer((envelope) => {
    envelope.tags = envelope.tags ?? [];
    envelope.tags["ai.cloud.role"] = "bg-counter-web";
  });

  return applicationInsights;
};

export const trackPageView = (path: string) => {
  initializeTelemetry()?.trackPageView({
    name: path,
    uri: `${window.location.origin}${path}`,
  });
};

export const trackEvent = (
  name: string,
  properties: TelemetryProperties = {},
  measurements: TelemetryMeasurements = {},
) => {
  initializeTelemetry()?.trackEvent({
    name,
    properties: normalizeProperties(properties),
    measurements,
  });
};
