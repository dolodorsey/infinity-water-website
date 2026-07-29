import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://infinitywaterco.com", changeFrequency: "weekly", priority: 1 },
    { url: "https://infinitywaterco.com/connect", changeFrequency: "monthly", priority: 0.7 },
    { url: "https://infinitywaterco.com/privacy", changeFrequency: "yearly", priority: 0.3 },
    { url: "https://infinitywaterco.com/terms", changeFrequency: "yearly", priority: 0.3 },
    { url: "https://infinitywaterco.com/contact", changeFrequency: "monthly", priority: 0.7 },
  ];
}
