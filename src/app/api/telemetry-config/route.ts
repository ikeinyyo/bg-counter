export const dynamic = "force-dynamic";

const getRuntimeEnvironmentVariable = (name: string) => process.env[name]?.trim();

export async function GET() {
  const connectionString =
    getRuntimeEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING") ??
    getRuntimeEnvironmentVariable(
      "NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING",
    );

  return Response.json(
    { connectionString: connectionString || null },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
