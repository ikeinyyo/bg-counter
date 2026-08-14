import { ApplicationInsights } from "@microsoft/applicationinsights-web";

type TelemetryProperties = Record<string, string | number | boolean | null | undefined>;
type TelemetryMeasurements = Record<string, number>;

let applicationInsights: ApplicationInsights | null = null;
let configurationResolved = false;
let pendingTelemetry: Array<(client: ApplicationInsights) => void> = [];

const normalizeProperties = (properties: TelemetryProperties = {}) =>
  Object.fromEntries(
    Object.entries(properties)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)]),
  );

export const configureTelemetry = (connectionString?: string) => {
  if (typeof window === "undefined" || configurationResolved) {
    return applicationInsights;
  }

  configurationResolved = true;
  const normalizedConnectionString = connectionString?.trim();
  if (!normalizedConnectionString) {
    pendingTelemetry = [];
    return null;
  }

  applicationInsights = new ApplicationInsights({
    config: {
      connectionString: normalizedConnectionString,
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

  pendingTelemetry.forEach((send) => send(applicationInsights!));
  pendingTelemetry = [];

  return applicationInsights;
};

const sendOrQueue = (send: (client: ApplicationInsights) => void) => {
  if (applicationInsights) {
    send(applicationInsights);
  } else if (!configurationResolved && pendingTelemetry.length < 100) {
    pendingTelemetry.push(send);
  }
};

export const trackPageView = (path: string) => {
  if (typeof window === "undefined") return;
  sendOrQueue((client) => {
    client.trackPageView({
      name: path,
      uri: `${window.location.origin}${path}`,
    });
  });
};

export const trackEvent = (
  name: string,
  properties: TelemetryProperties = {},
  measurements: TelemetryMeasurements = {},
) => {
  sendOrQueue((client) => {
    client.trackEvent({
      name,
      properties: normalizeProperties(properties),
      measurements,
    });
  });
};
