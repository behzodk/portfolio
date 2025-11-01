// src/app/blog/page.jsx
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, ChevronDown } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder"
import { blogPosts } from "@/lib/data"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState(null)

  const allTags = useMemo(() => {
    const tags = new Set()
    blogPosts.forEach((post) => post.tags.forEach((t) => tags.add(t)))
    return Array.from(tags).sort((a, b) => a.localeCompare(b))
  }, [])

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return blogPosts.filter((post) => {
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q)
      const matchesTag = !selectedTag || post.tags.includes(selectedTag)
      return matchesSearch && matchesTag
    })
  }, [searchQuery, selectedTag])

  return (
    <div className="w-full">
      {/* Sticky Header with Integrated Search & Filter */}
      <section className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-4 bg-background/90 backdrop-blur border-b border-border/60 supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left side: Title and Subtitle */}
              <div>
                <h1 className="text-3xl font-bold">Blog</h1>
                <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
                  Notes on ideas, tools, and things I’m learning.
                </p>
              </div>

              {/* Right side: Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* Search */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    aria-label="Search articles"
                    placeholder="Search articles…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-md border border-border bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                  />
                </div>

                {/* Tag dropdown */}
                <div className="relative w-full sm:w-48">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    aria-label="Filter by tag"
                    value={selectedTag ?? "__all__"}
                    onChange={(e) =>
                      setSelectedTag(e.target.value === "__all__" ? null : e.target.value)
                    }
                    className="appearance-none w-full pl-9 pr-8 py-1.5 rounded-md border border-border bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                  >
                    <option value="__all__">All tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Posts */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {filteredPosts.length > 0 ? (
            <div className="space-y-10">
              {filteredPosts.map((post, index) => (
                <AnimatedSection key={post.id} delay={index * 0.05}>
                  <Link href={`/blog/${post.slug}`}>
                    <article className="group cursor-pointer pb-10 border-b border-border last:border-b-0 last:pb-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative h-40 md:h-full rounded-lg overflow-hidden bg-muted">
                          <ImageWithPlaceholder
                            src={"/chess-board-ai.jpg"}
                            alt={post.title}
                            width={400}
                            height={300}
                            className="group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="md:col-span-2 flex flex-col justify-between">
                          <div>
                            <time className="text-xs sm:text-sm text-muted-foreground">
                              {new Date(post.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </time>
                            <h2 className="text-2xl font-bold mt-2 mb-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h2>
                            <p className="text-muted-foreground text-sm sm:text-base">
                              {post.summary}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 bg-muted rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
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