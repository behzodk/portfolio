export type BlogListPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published_at: string | null
  thumbnail?: string | null
}

export type BlogPostSection = {
  id: string
  type: "text" | "image" | "video"
  position: number
  content: string | null
}

export type BlogPostDetail = BlogListPost & {
  content?: string | null
  sections?: BlogPostSection[]
}
