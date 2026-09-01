import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message is too long"),
  website: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export function isRateLimited(
  store: Map<string, number[]>,
  key: string,
  now: number,
  opts: { max: number; windowMs: number },
): boolean {
  const timestamps = (store.get(key) ?? []).filter(
    (t) => now - t < opts.windowMs,
  );

  const limited = timestamps.length >= opts.max;
  timestamps.push(now);
  store.set(key, timestamps);

  return limited;
}
