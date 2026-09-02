import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export function createSessionValue(
  secret: string,
  now: number,
  maxAgeMs: number,
): string {
  const expiry = now + maxAgeMs;
  const signature = createHmac("sha256", secret).update(String(expiry)).digest("hex");
  return `${expiry}.${signature}`;
}

export function verifySessionValue(
  value: string,
  secret: string,
  now: number,
): boolean {
  const [expiryPart, signature] = value.split(".");
  if (!expiryPart || !signature) {
    return false;
  }

  const expected = createHmac("sha256", secret).update(expiryPart).digest("hex");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return false;
  }

  const expiry = Number(expiryPart);
  if (!Number.isFinite(expiry)) {
    return false;
  }

  return now < expiry;
}

export async function requireAdminSession(): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  const value = cookieStore.get("admin_session")?.value;
  if (!value) {
    return false;
  }

  return verifySessionValue(value, secret, Date.now());
}
