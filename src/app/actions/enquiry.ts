"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { sendEnquiryEmails } from "@/lib/email";
import { type EnquiryInput, type EnquiryState, enquirySchema } from "@/lib/enquiry-schema";
import { createPublicClient } from "@/lib/supabase/public";
import { verifyTurnstile } from "@/lib/turnstile";

const SUCCESS: EnquiryState = {
  status: "success",
  message: "Thank you! Your enquiry has been sent. I'll get back to you soon.",
};

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  // Honeypot: real people never fill the hidden "website" field. Pretend it worked.
  if (String(formData.get("website") ?? "").trim() !== "") return SUCCESS;

  const parsed = enquirySchema.safeParse({
    name: formData.get("name") ?? "",
    brand: formData.get("brand") ?? "",
    email: formData.get("email") ?? "",
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof EnquiryInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof EnquiryInput;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }

  const requestHeaders = await headers();
  const ip = requestHeaders.get("cf-connecting-ip") ?? requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const token = formData.get("cf-turnstile-response");
  if (!(await verifyTurnstile(typeof token === "string" ? token : null, ip))) {
    return { status: "error", message: "Spam check failed. Please wait for the check to finish and try again." };
  }

  const db = createPublicClient();
  if (!db) {
    return { status: "error", message: "Enquiries are not available right now. Please email me directly." };
  }

  const enquiry = parsed.data;
  const { error } = await db.from("enquiries").insert({
    name: enquiry.name,
    brand: enquiry.brand || null,
    email: enquiry.email,
    message: enquiry.message,
  });
  if (error) {
    console.error("[enquiry] insert failed:", error);
    return { status: "error", message: "Something went wrong sending your enquiry. Please try again." };
  }

  // Email after responding, so a slow mail provider never delays the visitor.
  after(() => sendEnquiryEmails(enquiry));
  return SUCCESS;
}
