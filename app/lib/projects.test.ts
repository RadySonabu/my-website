import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("./redis", () => ({
  redis: { get: vi.fn() },
}));

import { redis } from "./redis";
import { getAllProjects, getProjectBySlug } from "./projects";

const mockGet = vi.mocked(redis.get);

beforeEach(() => {
  mockGet.mockReset();
});

describe("getAllProjects", () => {
  it("returns an empty array when the index is missing", async () => {
    mockGet.mockResolvedValueOnce(null);
    expect(await getAllProjects()).toEqual([]);
  });

  it("returns an empty array when the index is empty", async () => {
    mockGet.mockResolvedValueOnce([]);
    expect(await getAllProjects()).toEqual([]);
  });

  it("returns all projects listed in the index", async () => {
    const projectOne = {
      slug: "one",
      title: "One",
      summary: "",
      description: "",
      techStack: [],
      role: "",
      year: "",
      featured: false,
    };
    const projectTwo = {
      slug: "two",
      title: "Two",
      summary: "",
      description: "",
      techStack: [],
      role: "",
      year: "",
      featured: false,
    };

    mockGet
      .mockResolvedValueOnce(["one", "two"])
      .mockResolvedValueOnce(projectOne)
      .mockResolvedValueOnce(projectTwo);

    expect(await getAllProjects()).toEqual([projectOne, projectTwo]);
  });
});

describe("getProjectBySlug", () => {
  it("returns the project for a known slug", async () => {
    const project = {
      slug: "one",
      title: "One",
      summary: "",
      description: "",
      techStack: [],
      role: "",
      year: "",
      featured: false,
    };
    mockGet.mockResolvedValueOnce(project);

    expect(await getProjectBySlug("one")).toEqual(project);
  });

  it("returns undefined for a missing slug", async () => {
    mockGet.mockResolvedValueOnce(null);
    expect(await getProjectBySlug("does-not-exist")).toBeUndefined();
  });
});
