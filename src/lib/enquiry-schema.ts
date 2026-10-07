// zod/mini keeps the same validation in a much smaller client bundle.
import * as z from "zod/mini";

/** Shared by the client form (React Hook Form) and the server action. Mirrors the DB checks. */
export const enquirySchema = z.object({
  name: z
    .string()
    .check(
      z.trim(),
      z.minLength(2, "Please enter your name (at least 2 characters)."),
      z.maxLength(100, "Name is too long."),
    ),
  brand: z.optional(z.string().check(z.trim(), z.maxLength(120, "Brand / company is too long (120 characters max)."))),
  email: z.pipe(
    z.string().check(z.trim(), z.maxLength(200, "Email is too long.")),
    z.email("Please enter a valid email address."),
  ),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(10, "Tell me a little more (at least 10 characters)."),
      z.maxLength(2000, "Please keep it under 2000 characters."),
    ),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<keyof EnquiryInput, string>> };
