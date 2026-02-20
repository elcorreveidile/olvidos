import { auth } from "@/lib/auth";

export default async function TestAuthPage() {
  const session = await auth();

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Test Auth Page</h1>
      <h2>Session Data:</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>

      <h2>Environment:</h2>
      <pre>{JSON.stringify({
        hasSecret: !!process.env.AUTH_SECRET,
        hasGitHubId: !!process.env.AUTH_GITHUB_ID,
        hasGitHubSecret: !!process.env.AUTH_GITHUB_SECRET,
        nodeEnv: process.env.NODE_ENV,
      }, null, 2)}</pre>

      <a href="/">← Back to home</a>
    </div>
  );
}
