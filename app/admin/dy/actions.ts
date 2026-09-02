"use server";

import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionValue } from "@/app/lib/session";
import { isRateLimited } from "@/app/lib/contact";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const RATE_LIMIT = { max: 5, windowMs: 15 * 60 * 1000 };
const attemptsByIp = new Map<string, number[]>();

const GENERIC_ERROR = "Invalid password.";

export async function login(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = formData.get("password");

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.SESSION_SECRET;

  if (!passwordHash || !sessionSecret || typeof password !== "string") {
    return { error: GENERIC_ERROR };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(attemptsByIp, ip, Date.now(), RATE_LIMIT)) {
    return { error: GENERIC_ERROR };
  }

  const valid = await bcrypt.compare(password, passwordHash);
  if (!valid) {
    return { error: GENERIC_ERROR };
  }

  const sessionValue = createSessionValue(
    sessionSecret,
    Date.now(),
    SESSION_MAX_AGE_MS,
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  });

  redirect("/admin/dy/dashboard");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/dy");
}
