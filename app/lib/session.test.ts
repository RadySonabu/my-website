import { describe, expect, it } from "vitest";
import { createSessionValue, verifySessionValue } from "./session";

const SECRET = "test-secret";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

describe("createSessionValue / verifySessionValue", () => {
  it("verifies a freshly created value", () => {
    const now = Date.now();
    const value = createSessionValue(SECRET, now, MAX_AGE_MS);
    expect(verifySessionValue(value, SECRET, now)).toBe(true);
  });

  it("rejects a tampered value", () => {
    const now = Date.now();
    const value = createSessionValue(SECRET, now, MAX_AGE_MS);
    const [expiry] = value.split(".");
    const tampered = `${expiry}.deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef`;
    expect(verifySessionValue(tampered, SECRET, now)).toBe(false);
  });

  it("rejects an expired value", () => {
    const now = Date.now();
    const value = createSessionValue(SECRET, now, MAX_AGE_MS);
    const wayLater = now + MAX_AGE_MS + 1000;
    expect(verifySessionValue(value, SECRET, wayLater)).toBe(false);
  });

  it("rejects a value signed with a different secret", () => {
    const now = Date.now();
    const value = createSessionValue(SECRET, now, MAX_AGE_MS);
    expect(verifySessionValue(value, "wrong-secret", now)).toBe(false);
  });

  it("rejects a malformed value", () => {
    expect(verifySessionValue("garbage", SECRET, Date.now())).toBe(false);
  });
});
