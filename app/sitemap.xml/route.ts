import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://behzod.uk"
  const routes = [
    "",
    "/about",
    "/services",
    "/blog",
    "/portfolio",
    "/gallery",
    "/contact",
    "/privacy",
    "/shorten-url",
  ]

  const lastModified = new Date().toISOString()

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
  }))
}
