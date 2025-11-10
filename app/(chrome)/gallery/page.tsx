"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, X, Search, SlidersHorizontal, Filter, ChevronDown } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder"
import { galleryImages } from "@/lib/data"

// ---- Types ----
type SortKey = "newest" | "oldest" | "az"
type OpenMenu = "sort" | "filter" | null

// Ensure your galleryImages match (add 'date' if you have it)
type GalleryImage = {
  id?: number | string
  src: string
  alt?: string
  caption?: string
  category?: string
  date?: string // ISO date like "2025-10-31" (optional)
}

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortKey>("newest")
  const [visibleCount, setVisibleCount] = useState<number>(12)

  // dropdown state
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
  const sortRef = useRef<HTMLDivElement | null>(null)
  const filterRef = useRef<HTMLDivElement | null>(null)

  const searchInputRef = useRef<HTMLInputElement | null>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        openMenu &&
        !sortRef.current?.contains(e.target as Node) &&
        !filterRef.current?.contains(e.target as Node)
      ) {
        setOpenMenu(null)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [openMenu])

  // Keyboard shortcuts: "/" focuses search, ESC closes lightbox/menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && (document.activeElement?.tagName ?? "").toLowerCase() !== "input") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === "Escape") {
        if (openMenu) setOpenMenu(null)
        else if (selectedIndex !== null) setSelectedIndex(null)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedIndex, openMenu])

  // Build categories with counts
  const categories = useMemo<[string, number][]>(() => {
    const map = new Map<string, number>()
    ;(galleryImages as GalleryImage[]).forEach((img) => {
      const cat = img.category || "Uncategorized"
      map.set(cat, (map.get(cat) || 0) + 1)
    })
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [])

  // Filter + search + sort
  const filtered = useMemo<GalleryImage[]>(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = (galleryImages as GalleryImage[]).filter((img) => {
      const catOk = !selectedCategory || (img.category || "Uncategorized") === selectedCategory
      const text = `${img.caption || ""} ${img.alt || ""} ${img.category || ""}`.toLowerCase()
      const qOk = !q || text.includes(q)
      return catOk && qOk
    })

    list = list.slice().sort((a, b) => {
      if (sortBy === "az") {
        return (a.caption || "").localeCompare(b.caption || "")
      }
      const ad = a.date ? new Date(a.date).getTime() : 0
      const bd = b.date ? new Date(b.date).getTime() : 0
      return sortBy === "newest" ? bd - ad : ad - bd
    })
    return list
  }, [selectedCategory, searchQuery, sortBy])

  // Clamp selected index if filters change
  useEffect(() => {
    if (selectedIndex !== null && selectedIndex >= filtered.length) {
      setSelectedIndex(null)
    }
  }, [filtered.length, selectedIndex])

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [selectedIndex])

  // Preload lightbox neighbors
  useEffect(() => {
    if (selectedIndex === null || filtered.length === 0) return
    const prev = (selectedIndex - 1 + filtered.length) % filtered.length
    const next = (selectedIndex + 1) % filtered.length
    ;[prev, next].forEach((i) => {
      const src = filtered[i]?.src
      if (src) {
        const img = new Image()
        img.src = src
      }
    })
  }, [selectedIndex, filtered])

  const handlePrevious = () => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => {
      if (prev === null) return prev
      return (prev - 1 + filtered.length) % filtered.length
    })
  }
  const handleNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => {
      if (prev === null) return prev
      return (prev + 1) % filtered.length
    })
  }

  const handleLightboxKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (selectedIndex === null) return
    if (e.key === "ArrowLeft") handlePrevious()
    if (e.key === "ArrowRight") handleNext()
    if (e.key === "Escape") setSelectedIndex(null)
  }

  const visible = filtered.slice(0, visibleCount)

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {/* Light theme */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-center bg-cover dark:hidden"
            style={{ backgroundImage: "url('/cover.jpg')" }}
          />
          {/* Dark theme */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-center bg-cover hidden dark:block"
            style={{ backgroundImage: "url('/cover2.jpg')" }}
          />
          {/* Readability overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-background/85 dark:from-black/40 dark:via-black/30 dark:to-background/80" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Gallery</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Visual showcase of my projects, research, and creative work.
            </p>

            <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center">
              {/* Search */}
              <div className="flex items-center gap-2 w-full md:max-w-md rounded-xl border bg-background px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  id="gallery-search"
                  placeholder="Search (press / to focus)…"
                  value={searchQuery}
                  onChange={(e) => {
                    setVisibleCount(12)
                    setSearchQuery(e.target.value)
                  }}
                  className="w-full bg-transparent outline-none text-sm md:text-base"
                />
              </div>

              {/* Sort dropdown */}
              <div ref={sortRef} className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === "sort" ? null : "sort")}
                  aria-haspopup="menu"
                  aria-expanded={openMenu === "sort"}
                  className="inline-flex items-center gap-2 rounded-xl border bg-background px-3 py-2 hover:bg-muted/60 transition"
                >
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm md:text-base">Sort</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openMenu === "sort" ? "rotate-180" : ""}`} />
                </button>

                {openMenu === "sort" && (
                  <div
                    role="menu"
                    tabIndex={-1}
                    className="absolute z-40 mt-2 w-48 rounded-xl border bg-background shadow-lg p-1"
                  >
                    {([
                      { key: "newest", label: "Newest" },
                      { key: "oldest", label: "Oldest" },
                      { key: "az", label: "A–Z" },
                    ] as { key: SortKey; label: string }[]).map((opt) => (
                      <button
                        key={opt.key}
                        role="menuitemradio"
                        aria-checked={sortBy === opt.key}
                        onClick={() => {
                          setSortBy(opt.key)
                          setOpenMenu(null)
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted/70 ${
                          sortBy === opt.key ? "bg-muted/70" : ""
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.key ? (
                          <span className="text-xs text-muted-foreground">●</span>
                        ) : (
                          <span className="text-xs opacity-0">●</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter (category) dropdown */}
              <div ref={filterRef} className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === "filter" ? null : "filter")}
                  aria-haspopup="menu"
                  aria-expanded={openMenu === "filter"}
                  className="inline-flex items-center gap-2 rounded-xl border bg-background px-3 py-2 hover:bg-muted/60 transition"
                >
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm md:text-base">{selectedCategory || "Filter"}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openMenu === "filter" ? "rotate-180" : ""}`} />
                </button>

                {openMenu === "filter" && (
                  <div role="menu" tabIndex={-1} className="absolute z-40 mt-2 w-64 rounded-xl border bg-background shadow-lg p-2">
                    <div className="max-h-64 overflow-auto pr-1">
                      <button
                        role="menuitemradio"
                        aria-checked={selectedCategory === null}
                        onClick={() => {
                          setSelectedCategory(null)
                          setVisibleCount(12)
                          setOpenMenu(null)
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted/70 ${
                          selectedCategory === null ? "bg-muted/70" : ""
                        }`}
                      >
                        <span>All</span>
                        <span className="text-xs text-muted-foreground">{(galleryImages as GalleryImage[]).length}</span>
                      </button>

                      {categories.map(([cat, count]) => (
                        <button
                          key={cat}
                          role="menuitemradio"
                          aria-checked={selectedCategory === cat}
                          onClick={() => {
                            setSelectedCategory(cat)
                            setVisibleCount(12)
                            setOpenMenu(null)
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted/70 ${
                            selectedCategory === cat ? "bg-muted/70" : ""
                          }`}
                        >
                          <span className="truncate">{cat}</span>
                          <span className="text-xs text-muted-foreground">{count}</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(null)
                          setOpenMenu(null)
                        }}
                        className="text-xs px-2 py-1 rounded-md hover:bg-muted/70"
                      >
                        Clear
                      </button>
                      <button onClick={() => setOpenMenu(null)} className="text-xs px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90">
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Count */}
              <div className="text-sm text-muted-foreground md:ml-auto" aria-live="polite">
                {filtered.length} item{filtered.length !== 1 ? "s" : ""}
                {selectedCategory ? ` • ${selectedCategory}` : ""}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Masonry */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {visible.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No images match your search.</div>
          ) : (
            <>
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {visible.map((image, i) => {
                  const filteredIndex = i // indices align within 'visible' slice
                  return (
                    <AnimatedSection key={(image.id ?? `${image.src}-${i}`) as React.Key} delay={i * 0.04}>
                      <button
                        onClick={() => setSelectedIndex(filteredIndex)}
                        className="group cursor-pointer w-full break-inside-avoid"
                        aria-label={`Open image: ${image.alt || image.caption || "Image"}`}
                      >
                        <div className="relative rounded-xl overflow-hidden border bg-muted hover:opacity-90 transition">
                          <ImageWithPlaceholder
                            src={image.src || "/placeholder.svg"}
                            alt={image.alt || image.caption || "Gallery image"}
                            width={800}
                            height={600}
                            className="w-full h-auto"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-4">
                            {(image.caption || image.category) && (
                              <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                {image.caption || image.category}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    </AnimatedSection>
                  )
                })}
              </div>

              {/* Load more */}
              {visibleCount < filtered.length && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setVisibleCount((v) => v + 12)}
                    className="px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedIndex !== null && filtered[selectedIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          tabIndex={-1}
          onKeyDown={handleLightboxKeyDown}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedIndex(null)
          }}
        >
          {/* Close */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Prev */}
          <button
            onClick={handlePrevious}
            className="absolute left-2 sm:left-4 p-2 hover:bg-white/10 rounded-lg transition"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Image */}
          <div className="max-w-5xl w-full">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <ImageWithPlaceholder
                src={filtered[selectedIndex].src || "/placeholder.svg"}
                alt={filtered[selectedIndex].alt || filtered[selectedIndex].caption || "Gallery image"}
                width={1600}
                height={1200}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="mt-4 text-center text-white">
              {(filtered[selectedIndex].caption || filtered[selectedIndex].category) && (
                <p className="text-lg font-medium">{filtered[selectedIndex].caption || filtered[selectedIndex].category}</p>
              )}
              <p className="text-sm text-white/60 mt-2">
                {selectedIndex + 1} / {filtered.length}
              </p>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 p-2 hover:bg-white/10 rounded-lg transition"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
    </div>
  )
}
