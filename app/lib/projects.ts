import { redis } from "./redis";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  role: string;
  year: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
};

const INDEX_KEY = "project:index";

function projectKey(slug: string): string {
  return `project:${slug}`;
}

export async function getAllProjects(): Promise<Project[]> {
  const slugs = (await redis.get<string[]>(INDEX_KEY)) ?? [];
  if (slugs.length === 0) {
    return [];
  }

  const records = await Promise.all(
    slugs.map((slug) => redis.get<Project>(projectKey(slug))),
  );

  return records.filter((project): project is Project => project !== null);
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const project = await redis.get<Project>(projectKey(slug));
  return project ?? undefined;
}
