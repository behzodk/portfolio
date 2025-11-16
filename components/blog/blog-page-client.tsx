"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder"
import type { BlogListPost } from "@/lib/types/blog"

function formatDate(dateString: string | null) {
  if (!dateString) return "Unpublished"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

interface BlogPageClientProps {
  posts: BlogListPost[]
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(q) ||
        (post.excerpt ?? "").toLowerCase().includes(q)
      )
    })
  }, [posts, searchQuery])

  return (
    <div className="w-full">
      <section className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-4 bg-background/90 backdrop-blur border-b border-border/60 supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Blog</h1>
                <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
                  Notes on ideas, tools, and things I’m learning.
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  aria-label="Search articles"
                  placeholder="Search articles…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {filtered.length > 0 ? (
            <div className="space-y-10">
              {filtered.map((post, index) => (
                <AnimatedSection key={post.id} delay={index * 0.05}>
                  <Link href={`/blog/${post.slug}`}>
                    <article className="group cursor-pointer pb-10 border-b border-border last:border-b-0 last:pb-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative h-40 md:h-full rounded-lg overflow-hidden bg-muted">
                          <ImageWithPlaceholder
                            src={post.thumbnail || "/chess-board-ai.jpg"}
                            alt={post.title}
                            width={400}
                            height={300}
                            className="group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="md:col-span-2 flex flex-col justify-between">
                          <div>
                            <time className="text-xs sm:text-sm text-muted-foreground">
                              {formatDate(post.published_at)}
                            </time>
                            <h2 className="text-2xl font-bold mt-2 mb-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h2>
                            <p className="text-muted-foreground text-sm sm:text-base">
                              {post.excerpt ?? "No summary available."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No articles found.</p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  )
}
