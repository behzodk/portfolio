import { createSupabaseServerClient } from "@/lib/supabase-server"
import { BlogPageClient } from "@/components/blog/blog-page-client"
import type { BlogListPost } from "@/lib/types/blog"

export const revalidate = 60

export default async function BlogPage() {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, published_at, status, sections ( type, position, content )")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Failed to load posts:", error.message)
  }

  const posts: BlogListPost[] = (data ?? []).map((post) => {
    const sections = (post as any).sections ?? []
    const firstImage = sections
      .filter((s: any) => s.type === "image")
      .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))[0]

    return {
      id: String(post.id),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? null,
      published_at: post.published_at ?? null,
      thumbnail: firstImage?.content ?? null,
    }
  })

  return <BlogPageClient posts={posts} />
}
