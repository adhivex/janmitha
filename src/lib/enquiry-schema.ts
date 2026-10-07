import { z } from "zod";

/** Shared by the client form (React Hook Form) and the server action. Mirrors the DB checks. */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name (at least 2 characters).").max(100, "Name is too long."),
  brand: z.string().trim().max(120, "Brand / company is too long (120 characters max).").optional().or(z.literal("")),
  email: z.string().trim().max(200, "Email is too long.").pipe(z.email("Please enter a valid email address.")),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more (at least 10 characters).")
    .max(2000, "Please keep it under 2000 characters."),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<keyof EnquiryInput, string>> };
