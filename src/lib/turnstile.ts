import "server-only";

/**
 * Verifies a Cloudflare Turnstile token. Without TURNSTILE_SECRET_KEY the check is
 * skipped in development and fails closed in production.
 */
export async function verifyTurnstile(token: string | null, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("[turnstile] verification request failed:", error);
    return false;
  }
}
