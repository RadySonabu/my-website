"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <form action={formAction} className="flex w-full max-w-xs flex-col gap-4">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-foreground outline-none focus:border-white/30"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            borderColor: "var(--hero-cream)",
            color: "var(--hero-cream)",
          }}
        >
          {pending ? "Checking..." : "Log in"}
        </button>
        {state?.error && (
          <p className="text-sm text-muted">{state.error}</p>
        )}
      </form>
    </main>
  );
}
