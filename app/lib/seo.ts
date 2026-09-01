import type { Project } from "./projects";

export function buildSitemapEntries(baseUrl: string, projects: Project[]) {
  const staticRoutes = ["/"];
  const projectRoutes = projects.map((project) => `/projects/${project.slug}`);

  return [...staticRoutes, ...projectRoutes].map((path) => ({
    url: `${baseUrl}${path}`,
  }));
}
