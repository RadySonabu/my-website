import { describe, expect, it } from "vitest";
import { buildSitemapEntries } from "./seo";

describe("buildSitemapEntries", () => {
  it("returns the static routes when there are no projects", () => {
    const entries = buildSitemapEntries("https://example.com", []);
    expect(entries).toEqual([{ url: "https://example.com/" }]);
  });

  it("includes a URL for each project", () => {
    const entries = buildSitemapEntries("https://example.com", [
      {
        slug: "my-project",
        title: "My Project",
        summary: "",
        description: "",
        techStack: [],
        role: "",
        year: "",
        featured: false,
      },
    ]);

    expect(entries).toEqual([
      { url: "https://example.com/" },
      { url: "https://example.com/projects/my-project" },
    ]);
  });
});
