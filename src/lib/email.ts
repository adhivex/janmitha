import "server-only";
import { Resend } from "resend";
import type { EnquiryInput } from "./enquiry-schema";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Notifies Janmitha and sends a short auto-reply. Skipped (with a log line) when
 * Resend is not configured; the enquiry is already saved in the database.
 */
export async function sendEnquiryEmails(enquiry: EnquiryInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.warn("[email] Resend not configured; enquiry saved without sending email.");
    return;
  }
  const resend = new Resend(apiKey);
  const brand = enquiry.brand ? ` (${enquiry.brand})` : "";

  const notify = resend.emails.send({
    from,
    to,
    replyTo: enquiry.email,
    subject: `New enquiry from ${enquiry.name}${brand}`,
    text: `Name: ${enquiry.name}\nBrand: ${enquiry.brand || "-"}\nEmail: ${enquiry.email}\n\n${enquiry.message}`,
    html: `<p><strong>Name:</strong> ${escape(enquiry.name)}<br><strong>Brand:</strong> ${escape(enquiry.brand || "-")}<br><strong>Email:</strong> ${escape(enquiry.email)}</p><p style="white-space:pre-wrap">${escape(enquiry.message)}</p>`,
  });
  const autoReply = resend.emails.send({
    from,
    to: enquiry.email,
    subject: "Thank you for reaching out",
    text: `Hi ${enquiry.name},\n\nThank you for your enquiry. I have received your message and will get back to you soon.\n\nJanmitha`,
  });

  const results = await Promise.allSettled([notify, autoReply]);
  results.forEach((r) => {
    if (r.status === "rejected") console.error("[email] send failed:", r.reason);
    else if (r.value.error) console.error("[email] send failed:", r.value.error);
  });
}
