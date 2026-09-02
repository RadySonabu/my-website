import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "./lib/seo";
import { getAllProjects } from "./lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  return buildSitemapEntries("https://ardyubanos.vercel.app", projects);
}
