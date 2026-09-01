import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "./lib/seo";
import { getAllProjects } from "./lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries("https://ardyubanos.vercel.app", getAllProjects());
}
