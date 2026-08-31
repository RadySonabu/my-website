import { describe, expect, it } from "vitest";
import { getProjectBySlug } from "./projects";

describe("getProjectBySlug", () => {
  it("returns the matching project for a known slug", () => {
    const project = getProjectBySlug("sample-project-one");
    expect(project?.title).toBe("Sample Project One");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });
});
