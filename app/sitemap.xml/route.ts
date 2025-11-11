import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://behzod.co.uk"

  const routes = [
    "",
    "/about",
    "/services",
    "/blog",
    "/portfolio",
    "/gallery",
    "/contact",
    "/privacy",
    "/shorten-url"
  ]

  const lastmod = new Date().toISOString()

  const urls = routes
    .map(
      (path) =>
        `<url><loc>${baseUrl}${path}</loc><lastmod>${lastmod}</lastmod></url>`
    )
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>` +
              `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
              urls +
              `</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml"
    }
  })
}
