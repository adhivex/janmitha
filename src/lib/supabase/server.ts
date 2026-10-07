import "server-only";
import { createServerClient } from "@supabase/ssr";
import { connection } from "next/server";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { getSupabaseConfig } from "./config";

/** Session-aware client for the admin area. Reads and refreshes the auth cookies. */
export async function createSessionClient() {
  // Request-time only: the auth client reads the clock as soon as it is created.
  await connection();
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).");
  const cookieStore = await cookies();
  return createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component: the proxy refreshes cookies instead.
        }
      },
    },
  });
}
