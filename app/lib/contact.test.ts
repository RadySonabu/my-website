import { describe, expect, it } from "vitest";
import { contactFormSchema, isRateLimited } from "./contact";

describe("contactFormSchema", () => {
  it("accepts valid input", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello there",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = contactFormSchema.safeParse({
      name: "",
      email: "jane@example.com",
      message: "Hello there",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "not-an-email",
      message: "Hello there",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty message", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("isRateLimited", () => {
  const opts = { max: 3, windowMs: 15 * 60 * 1000 };

  it("allows submissions under the limit", () => {
    const store = new Map<string, number[]>();
    expect(isRateLimited(store, "1.2.3.4", 0, opts)).toBe(false);
    expect(isRateLimited(store, "1.2.3.4", 1000, opts)).toBe(false);
    expect(isRateLimited(store, "1.2.3.4", 2000, opts)).toBe(false);
  });

  it("blocks once the limit is reached", () => {
    const store = new Map<string, number[]>();
    isRateLimited(store, "1.2.3.4", 0, opts);
    isRateLimited(store, "1.2.3.4", 1000, opts);
    isRateLimited(store, "1.2.3.4", 2000, opts);
    expect(isRateLimited(store, "1.2.3.4", 3000, opts)).toBe(true);
  });

  it("does not count timestamps outside the window", () => {
    const store = new Map<string, number[]>();
    isRateLimited(store, "1.2.3.4", 0, opts);
    isRateLimited(store, "1.2.3.4", 1000, opts);
    isRateLimited(store, "1.2.3.4", 2000, opts);
    const farLater = 3000 + opts.windowMs + 1;
    expect(isRateLimited(store, "1.2.3.4", farLater, opts)).toBe(false);
  });
});
