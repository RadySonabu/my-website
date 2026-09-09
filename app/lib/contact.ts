import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message is too long"),
  website: z.string().optional(),
  renderedAt: z.number(),
  turnstileToken: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

const MIN_SUBMIT_DELAY_MS = 2000;

// Bots that skip the honeypot and script a submission tend to fire almost
// instantly after loading the page; a real person needs at least a couple
// of seconds to read and fill the form.
export function isSubmittedTooFast(renderedAt: number, now: number): boolean {
  return now - renderedAt < MIN_SUBMIT_DELAY_MS;
}
