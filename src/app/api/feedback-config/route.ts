export const dynamic = "force-dynamic";

const getRuntimeEnvironmentVariable = (name: string) => process.env[name]?.trim();

const getValidFeedbackUrl = (value?: string) => {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
};

export async function GET() {
  const configuredUrl =
    getRuntimeEnvironmentVariable("FEEDBACK_FORM_URL") ??
    getRuntimeEnvironmentVariable("NEXT_PUBLIC_FEEDBACK_FORM_URL");

  return Response.json(
    { feedbackUrl: getValidFeedbackUrl(configuredUrl) },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
