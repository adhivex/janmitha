import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseConfig } from "./config";

/**
 * Cookie-less anon client for public reads (safe inside "use cache") and for
 * inserting enquiries. Row Level Security limits it to what the public may do.
 */
export function createPublicClient() {
  const config = getSupabaseConfig();
  if (!config) return null;
  return createClient<Database>(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
