import type { MetadataRoute } from "next";
import { sitePages } from "@/lib/site-pages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://watertoinfinity.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-11T00:00:00Z");
  const routes = ["", ...Object.keys(sitePages), "connect", "forms"];
  return routes.map((route, index) => ({
    url: `${SITE_URL}${route ? `/${route}` : "/"}`,
    lastModified,
    changeFrequency: route === "forms" || route === "connect" ? "monthly" : "weekly",
    priority: index === 0 ? 1 : route === "wholesale" || route === "hospitality" ? 0.95 : 0.85,
  }));
}
