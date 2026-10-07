"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath, updateTag } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { UploadError, pickFile, removeUploaded, uploadFile } from "@/lib/admin/storage";
import type { ActionState } from "@/lib/admin/types";
import { TAGS } from "@/lib/queries";
import { createSessionClient } from "@/lib/supabase/server";

/* ------------------------------------------------------------------ helpers */

const text = (fd: FormData, key: string, max = 2000) => String(fd.get(key) ?? "").trim().slice(0, max);
const nullable = (fd: FormData, key: string, max = 2000) => text(fd, key, max) || null;
const checked = (fd: FormData, key: string) => fd.get(key) === "on";
const ok = (message: string): ActionState => ({ ok: true, message });
const fail = (message: string): ActionState => ({ ok: false, message });

/**
 * Refresh after an edit: expire the cached content (tags) and every rendered page,
 * so the change shows on the very next visit to the public site and the admin.
 */
function refresh(...tags: (keyof typeof TAGS)[]) {
  tags.forEach((t) => updateTag(TAGS[t]));
  revalidatePath("/", "layout");
}

async function guard<T>(run: () => Promise<T>): Promise<T | ActionState> {
  try {
    return await run();
  } catch (error) {
    // Let redirect() from requireAdmin propagate.
    unstable_rethrow(error);
    if (error instanceof UploadError) return fail(error.message);
    console.error("[admin] action failed:", error);
    return fail("Something went wrong. Please try again.");
  }
}

/* --------------------------------------------------------------------- auth */

export async function signIn(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = text(fd, "email", 200);
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return fail("Enter your email and password.");

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return fail("That email and password don't match an admin account.");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return fail("This account is not an admin. Ask for it to be added to admin_users.");
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ profile */

const PROFILE_TEXT = [
  "display_name",
  "hero_eyebrow",
  "hero_intro",
  "tagline",
  "bio",
  "beyond_frame",
  "city",
  "email",
  "instagram_url",
  "linkedin_url",
  "showreel_url",
  "story_video_url",
  "philosophy_headline",
  "philosophy_sub",
  "philosophy_quote",
] as const;

const PROFILE_FILES = [
  { field: "hero_image_url", folder: "profile", kind: "image" },
  { field: "about_image_url", folder: "profile", kind: "image" },
  { field: "philosophy_image_url", folder: "profile", kind: "image" },
  { field: "media_kit_url", folder: "media-kit", kind: "pdf" },
] as const;

export async function saveProfile(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return guard(async () => {
    const admin = await requireAdmin();
    const { data: current } = await admin.supabase.from("profile").select("*").eq("id", 1).maybeSingle();

    const update: Record<string, string | null> = {};
    for (const key of PROFILE_TEXT) update[key] = nullable(fd, key);
    if (!update.display_name) return fail("Display name is required.");

    for (const { field, folder, kind } of PROFILE_FILES) {
      const file = pickFile(fd.get(field));
      if (file) {
        update[field] = await uploadFile(admin, file, folder, kind);
        await removeUploaded(admin, current?.[field]);
      } else if (checked(fd, `remove_${field}`)) {
        update[field] = null;
        await removeUploaded(admin, current?.[field]);
      }
    }

    const { error } = await admin.supabase
      .from("profile")
      .upsert({ id: 1, ...update, display_name: update.display_name, updated_at: new Date().toISOString() });
    if (error) throw error;
    refresh("content");
    return ok("Profile saved. The site is updated.");
  });
}

/* ------------------------------------------- stats, brands, services, categories */

const LIST_TABLES = {
  stats: { fields: { value: 20, label: 60 }, required: ["value", "label"], tags: ["content"] },
  brands: { fields: { name: 80 }, required: ["name"], tags: ["content"] },
  services: { fields: { title: 80, description: 300 }, required: ["title", "description"], tags: ["content"] },
  portfolio_categories: { fields: { title: 80, slug: 80 }, required: ["title", "slug"], tags: ["content", "portfolio"] },
} as const;
type ListTable = keyof typeof LIST_TABLES;

function listTable(fd: FormData): ListTable {
  const table = text(fd, "table");
  if (!(table in LIST_TABLES)) throw new Error(`Unknown table ${table}`);
  return table as ListTable;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function readListFields(table: ListTable, fd: FormData) {
  const config = LIST_TABLES[table];
  const values: Record<string, string> = {};
  for (const [key, max] of Object.entries(config.fields)) values[key] = text(fd, key, max);
  if (table === "portfolio_categories") values.slug = slugify(values.slug || values.title);
  const missing = config.required.filter((k) => !values[k]);
  return { values, missing };
}

export async function createListRow(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return guard(async () => {
    const admin = await requireAdmin();
    const table = listTable(fd);
    const { values, missing } = readListFields(table, fd);
    if (missing.length) return fail(`Please fill in: ${missing.join(", ")}.`);

    const db = admin.supabase as unknown as SupabaseClient;
    const { data: last } = await db.from(table).select("sort_order").order("sort_order", { ascending: false }).limit(1);
    const sort_order = ((last?.[0]?.sort_order as number | undefined) ?? 0) + 1;

    const row: Record<string, unknown> = { ...values, sort_order, is_visible: true };
    if (table === "portfolio_categories") {
      const cover = pickFile(fd.get("cover"));
      if (cover) row.cover_url = await uploadFile(admin, cover, "covers");
    }
    const { error } = await db.from(table).insert(row);
    if (error) return fail(error.code === "23505" ? "That slug is already used." : error.message);
    refresh(...LIST_TABLES[table].tags);
    return ok("Added.");
  });
}

export async function mutateListRow(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return guard(async () => {
    const admin = await requireAdmin();
    const table = listTable(fd);
    const id = text(fd, "id", 64);
    const intent = text(fd, "intent");
    const db = admin.supabase as unknown as SupabaseClient;

    if (intent === "delete") {
      const { data: existing } = await db.from(table).select("*").eq("id", id).maybeSingle();
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw error;
      if (table === "portfolio_categories") await removeUploaded(admin, existing?.cover_url as string | null);
      refresh(...LIST_TABLES[table].tags);
      return ok("Deleted.");
    }

    if (intent === "up" || intent === "down") {
      await move(db, table, id, intent === "up" ? -1 : 1);
      refresh(...LIST_TABLES[table].tags);
      return ok("Order updated.");
    }

    const { values, missing } = readListFields(table, fd);
    if (missing.length) return fail(`Please fill in: ${missing.join(", ")}.`);
    const update: Record<string, unknown> = { ...values, is_visible: checked(fd, "is_visible") };
    if (table === "portfolio_categories") {
      const { data: existing } = await db.from(table).select("cover_url").eq("id", id).maybeSingle();
      const cover = pickFile(fd.get("cover"));
      if (cover) {
        update.cover_url = await uploadFile(admin, cover, "covers");
        await removeUploaded(admin, existing?.cover_url as string | null);
      } else if (checked(fd, "remove_cover")) {
        update.cover_url = null;
        await removeUploaded(admin, existing?.cover_url as string | null);
      }
    }
    const { error } = await db.from(table).update(update).eq("id", id);
    if (error) return fail(error.code === "23505" ? "That slug is already used." : error.message);
    refresh(...LIST_TABLES[table].tags);
    return ok("Saved.");
  });
}

/** Swaps a row with its neighbour and renumbers sort_order 1..n within the scope. */
async function move(
  db: SupabaseClient,
  table: string,
  id: string,
  delta: -1 | 1,
  scope?: { column: string; value: string },
) {
  let query = db.from(table).select("id, sort_order").order("sort_order").order("id");
  if (scope) query = query.eq(scope.column, scope.value);
  const { data, error } = await query;
  if (error) throw error;
  const ids = (data ?? []).map((r) => r.id as string);
  const at = ids.indexOf(id);
  const to = at + delta;
  if (at === -1 || to < 0 || to >= ids.length) return;
  [ids[at], ids[to]] = [ids[to], ids[at]];
  const updates = ids
    .map((rowId, i) => ({ id: rowId, sort_order: i + 1 }))
    .filter((r) => data!.find((d) => d.id === r.id)!.sort_order !== r.sort_order);
  for (const u of updates) {
    const { error: e } = await db.from(table).update({ sort_order: u.sort_order }).eq("id", u.id);
    if (e) throw e;
  }
}

/* ---------------------------------------------------------------- portfolio */

export async function uploadPhotos(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return guard(async () => {
    const admin = await requireAdmin();
    const files = fd.getAll("photos").map(pickFile).filter((f): f is File => !!f);
    const category_id = text(fd, "category_id", 64);
    if (!files.length) return fail("Choose at least one photo.");
    if (!category_id) return fail("Choose a category.");

    const { data: last } = await admin.supabase
      .from("portfolio_items")
      .select("sort_order")
      .eq("category_id", category_id)
      .order("sort_order", { ascending: false })
      .limit(1);
    let sort_order = (last?.[0]?.sort_order ?? 0) + 1;

    const yearText = text(fd, "year", 4);
    const year = /^\d{4}$/.test(yearText) ? Number(yearText) : null;
    for (const file of files) {
      const image_url = await uploadFile(admin, file, `items/${category_id}`);
      const { error } = await admin.supabase.from("portfolio_items").insert({
        category_id,
        image_url,
        alt_text: text(fd, "alt_text", 200),
        caption: nullable(fd, "caption", 200),
        year,
        is_featured: checked(fd, "is_featured"),
        sort_order: sort_order++,
      });
      if (error) throw error;
    }
    refresh("portfolio");
    return ok(files.length === 1 ? "Photo added to the site." : `${files.length} photos added to the site.`);
  });
}

export async function mutatePhoto(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return guard(async () => {
    const admin = await requireAdmin();
    const id = text(fd, "id", 64);
    const intent = text(fd, "intent");
    const { data: item } = await admin.supabase.from("portfolio_items").select("*").eq("id", id).maybeSingle();
    if (!item) return fail("That photo no longer exists.");

    if (intent === "delete") {
      const { error } = await admin.supabase.from("portfolio_items").delete().eq("id", id);
      if (error) throw error;
      await removeUploaded(admin, item.image_url);
      refresh("portfolio");
      return ok("Photo deleted.");
    }
    if (intent === "up" || intent === "down") {
      await move(admin.supabase as unknown as SupabaseClient, "portfolio_items", id, intent === "up" ? -1 : 1, {
        column: "category_id",
        value: item.category_id,
      });
      refresh("portfolio");
      return ok("Order updated.");
    }

    const yearText = text(fd, "year", 4);
    const category_id = text(fd, "category_id", 64) || item.category_id;
    const { error } = await admin.supabase
      .from("portfolio_items")
      .update({
        category_id,
        alt_text: text(fd, "alt_text", 200),
        caption: nullable(fd, "caption", 200),
        year: /^\d{4}$/.test(yearText) ? Number(yearText) : null,
        is_featured: checked(fd, "is_featured"),
        is_visible: checked(fd, "is_visible"),
      })
      .eq("id", id);
    if (error) throw error;
    refresh("portfolio");
    return ok("Saved.");
  });
}

/* ---------------------------------------------------------------- enquiries */

const STATUSES = ["new", "replied", "booked", "archived"] as const;

export async function updateEnquiry(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return guard(async () => {
    const admin = await requireAdmin();
    const status = text(fd, "status") as (typeof STATUSES)[number];
    if (!STATUSES.includes(status)) return fail("Unknown status.");
    const { error } = await admin.supabase.from("enquiries").update({ status }).eq("id", text(fd, "id", 64));
    if (error) throw error;
    revalidatePath("/admin", "layout");
    return ok(`Marked as ${status}.`);
  });
}
