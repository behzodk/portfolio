import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { AnimatedSection } from "@/components/ui/animated-section"
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder"
import { ShareSheet } from "@/components/ui/share-sheet"
import { ReadingProgress } from "@/components/ui/reading-progress"
import { calculateReadingTime } from "@/lib/reading-time"
import type { BlogPostDetail, BlogPostSection } from "@/lib/types/blog"

export const revalidate = 60

async function fetchPost(slug: string) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
        id,
        title,
        slug,
        excerpt,
        status,
        published_at,
        updated_at,
        sections (
          id,
          type,
          position,
          content
        )
      `,
    )
    .eq("slug", slug)
    .maybeSingle()

  if (error) {
    console.error("Failed to load post:", error.message)
  }

  return data as (BlogPostDetail & { sections: BlogPostSection[] }) | null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPost(slug)

  if (!post || post.status !== "published" || !post.published_at) {
    return { title: "Post Not Found" }
  }

  return {
    title: `${post.title} | Behzod's Blog`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.published_at ?? undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await fetchPost(slug)

  const isPublished =
    post &&
    post.status === "published" &&
    post.published_at &&
    new Date(post.published_at).getTime() <= Date.now()

  if (!post || !isPublished) {
    notFound()
  }

  const sections = (post.sections ?? []).sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  const textForReadingTime = sections
    .filter((s) => s.type === "text" && s.content)
    .map((s) => (s.content ?? "").replace(/<[^>]+>/g, ""))
    .join("\n\n")
  const readingTime = calculateReadingTime(textForReadingTime)

  const renderSection = (section: BlogPostSection) => {
    if (section.type === "image") {
      return (
        <div className="my-8">
          <ImageWithPlaceholder
            src={section.content || "/placeholder.svg"}
            alt={post.title}
            width={1200}
            height={600}
            className="rounded-lg"
          />
        </div>
      )
    }

    if (section.type === "video") {
      return (
        <div className="my-8 aspect-video w-full overflow-hidden rounded-lg bg-black/60">
          <video src={section.content ?? ""} controls className="h-full w-full object-cover" />
        </div>
      )
    }

    // text
    const content = section.content ?? ""
    return <div className="rich-text" dangerouslySetInnerHTML={{ __html: content }} />
  }

  return (
    <div className="w-full">
      <ReadingProgress />

      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <time>
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unpublished"}
              </time>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          {sections.map((section) => (
            <AnimatedSection key={section.id}>{renderSection(section)}</AnimatedSection>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection delay={0.1}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-muted rounded-full text-sm">Published</span>
              </div>
              <ShareSheet url={`/blog/${post.slug}`} title={post.title} description={post.excerpt ?? undefined} />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
