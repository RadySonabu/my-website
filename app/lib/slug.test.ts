import { describe, expect, it } from "vitest";
import { resolveUniqueSlug, slugify } from "./slug";

describe("slugify", () => {
  it("replaces spaces with hyphens", () => {
    expect(slugify("My Cool Project")).toBe("my-cool-project");
  });

  it("lowercases mixed case", () => {
    expect(slugify("CamelCase Title")).toBe("camelcase-title");
  });

  it("strips punctuation", () => {
    expect(slugify("Project: The Sequel!")).toBe("project-the-sequel");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  -Leading and Trailing-  ")).toBe(
      "leading-and-trailing",
    );
  });

  it("collapses consecutive separators to one hyphen", () => {
    expect(slugify("Too    Many   Spaces")).toBe("too-many-spaces");
  });
});

describe("resolveUniqueSlug", () => {
  it("returns the base slug when there is no collision", () => {
    expect(resolveUniqueSlug("my-project", ["other-project"], false)).toBe(
      "my-project",
    );
  });

  it("renumbers an auto-generated slug on collision", () => {
    expect(resolveUniqueSlug("my-project", ["my-project"], false)).toBe(
      "my-project-2",
    );
  });

  it("keeps renumbering until a free slug is found", () => {
    expect(
      resolveUniqueSlug(
        "my-project",
        ["my-project", "my-project-2"],
        false,
      ),
    ).toBe("my-project-3");
  });

  it("rejects a manually-edited collision instead of renumbering", () => {
    expect(resolveUniqueSlug("my-project", ["my-project"], true)).toBeNull();
  });
});
