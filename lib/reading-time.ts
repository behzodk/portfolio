export function calculateReadingTime(text: string): number {
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}
