"use server";

import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionValue } from "@/app/lib/session";
import { isLoginRateLimited } from "@/app/lib/rateLimit";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

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
  const forwardedFor = headerStore.get("x-forwarded-for");
  if (await isLoginRateLimited(forwardedFor)) {
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
