// Creates (or finds) a Supabase Auth user and adds it to public.admin_users.
// Usage: node --env-file=.env.local scripts/create-admin.mjs <email> [password]
// Needs SUPABASE_SERVICE_ROLE_KEY (server only, never shipped to the browser).
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const [email, given] = process.argv.slice(2);
if (!email) {
  console.error("Usage: node --env-file=.env.local scripts/create-admin.mjs <email> [password]");
  process.exit(1);
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const password = given ?? randomBytes(12).toString("base64url");

let userId;
const created = await db.auth.admin.createUser({ email, password, email_confirm: true });
if (created.error) {
  const { data } = await db.auth.admin.listUsers({ perPage: 1000 });
  const existing = data?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!existing) {
    console.error("Could not create user:", created.error.message);
    process.exit(1);
  }
  userId = existing.id;
  console.log(`User ${email} already exists; password unchanged.`);
} else {
  userId = created.data.user.id;
  console.log(`Created ${email}\nPassword: ${password}`);
}

const { error } = await db.from("admin_users").upsert({ user_id: userId });
if (error) {
  console.error("Could not add to admin_users:", error.message);
  process.exit(1);
}
console.log("Added to admin_users. They can sign in at /admin/login.");
