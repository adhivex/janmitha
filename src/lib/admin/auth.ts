import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

/**
 * Data Access Layer for the admin area. Verifies the session with the Auth server
 * and the admin_users allow-list (via the is_admin() SQL function). Call it at the
 * top of every admin page and Server Action.
 */
export async function requireAdmin() {
  const supabase = await createSessionClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/admin/login");

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-admin");
  }
  return { supabase, user: { id: user.id, email: user.email ?? "" } };
}

export type AdminContext = Awaited<ReturnType<typeof requireAdmin>>;
