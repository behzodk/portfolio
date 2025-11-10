import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder"
import { ShareSheet } from "@/components/ui/share-sheet"
import { ReadingProgress } from "@/components/ui/reading-progress"
import { blogPosts } from "@/lib/data"
import { calculateReadingTime } from "@/lib/reading-time"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Behzod's Blog`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
    },
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-primary hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const readingTime = calculateReadingTime(post.content)

  return (
    <div className="w-full">
      <ReadingProgress />

      {/* Header */}
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
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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

      {/* Featured Image */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="relative h-96 rounded-lg overflow-hidden bg-muted">
              <ImageWithPlaceholder
                src={post.cover || "/placeholder.svg"}
                alt={post.title}
                width={800}
                height={400}
                priority
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="prose prose-invert max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed space-y-4">
                {post.content.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("#")) {
                    const level = paragraph.match(/^#+/)?.[0].length || 1
                    const text = paragraph.replace(/^#+\s/, "")
                    const className =
                      {
                        1: "text-4xl font-bold mt-8 mb-4",
                        2: "text-2xl font-bold mt-6 mb-3",
                        3: "text-xl font-bold mt-4 mb-2",
                      }[level] || "text-lg font-bold mt-4 mb-2"
                    return (
                      <div key={index} className={className}>
                        {text}
                      </div>
                    )
                  }
                  return (
                    <p key={index} className="text-muted-foreground">
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            </div>
          </AnimatedSection>

          {/* Tags & Share */}
          <AnimatedSection delay={0.1} className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-muted rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <ShareSheet url={`/blog/${post.slug}`} title={post.title} description={post.summary} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-12">More Articles</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 2)
              .map((relatedPost, index) => (
                <AnimatedSection key={relatedPost.id} delay={index * 0.1}>
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <article className="group cursor-pointer h-full">
                      <div className="relative h-48 rounded-lg overflow-hidden mb-4 bg-muted">
                        <ImageWithPlaceholder
                          src={relatedPost.cover || "/placeholder.svg"}
                          alt={relatedPost.title}
                          width={400}
                          height={200}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-muted-foreground">{relatedPost.summary}</p>
                    </article>
                  </Link>
                </AnimatedSection>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
