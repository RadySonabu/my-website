import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/app/lib/redis";

const contactLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "15 m"),
  prefix: "ratelimit:contact",
});

const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "ratelimit:admin-login",
});

function firstIp(headerValue: string | null): string {
  if (!headerValue) return "unknown";
  return headerValue.split(",")[0].trim() || "unknown";
}

export async function isContactRateLimited(
  forwardedFor: string | null,
): Promise<boolean> {
  const { success } = await contactLimiter.limit(firstIp(forwardedFor));
  return !success;
}

export async function isLoginRateLimited(
  forwardedFor: string | null,
): Promise<boolean> {
  const { success } = await loginLimiter.limit(firstIp(forwardedFor));
  return !success;
}
