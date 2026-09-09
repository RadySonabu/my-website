"use client";

import Script from "next/script";
import { useRef, useState, type FormEvent } from "react";

type Status = "idle" | "pending" | "success" | "error";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const renderedAt = useRef(Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("pending");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
          renderedAt: renderedAt.current,
          turnstileToken: data.get("cf-turnstile-response"),
        }),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 text-left"
    >
      <div>
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-foreground outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-foreground outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-foreground outline-none focus:border-white/30"
        />
      </div>

      {/* Honeypot: hidden from real users, left blank; if a bot fills it, the API treats the submission as spam. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {TURNSTILE_SITE_KEY && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            async
            defer
          />
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />
        </>
      )}

      <button
        type="submit"
        disabled={status === "pending"}
        className="mt-2 inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          borderColor: "var(--hero-cream)",
          color: "var(--hero-cream)",
        }}
      >
        {status === "pending" ? "Sending..." : "Send message"}
      </button>

      {status === "success" && (
        <p className="text-sm text-muted">Thanks - your message has been sent.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-muted">
          Something went wrong. Please try again in a moment.
        </p>
      )}
    </form>
  );
}
