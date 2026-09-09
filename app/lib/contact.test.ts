import { describe, expect, it } from "vitest";
import { contactFormSchema, isSubmittedTooFast } from "./contact";

describe("contactFormSchema", () => {
  it("accepts valid input", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello there",
      renderedAt: Date.now(),
    });

    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = contactFormSchema.safeParse({
      name: "",
      email: "jane@example.com",
      message: "Hello there",
      renderedAt: Date.now(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "not-an-email",
      message: "Hello there",
      renderedAt: Date.now(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty message", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "",
      renderedAt: Date.now(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects a missing renderedAt", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello there",
    });

    expect(result.success).toBe(false);
  });
});

describe("isSubmittedTooFast", () => {
  it("flags a submission made within the minimum delay", () => {
    expect(isSubmittedTooFast(0, 500)).toBe(true);
    expect(isSubmittedTooFast(0, 1999)).toBe(true);
  });

  it("allows a submission made after the minimum delay", () => {
    expect(isSubmittedTooFast(0, 2000)).toBe(false);
    expect(isSubmittedTooFast(0, 5000)).toBe(false);
  });
});
