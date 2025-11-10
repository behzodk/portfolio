import Link from "next/link"
import { AlertTriangle } from "lucide-react"

interface ExpiredPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ExpiredPage({ searchParams }: ExpiredPageProps) {
  const params = (await searchParams) ?? {}
  const slugParam = params.slug
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md rounded-3xl border border-border/60 bg-card/80 p-8 text-center space-y-4 shadow-lg shadow-primary/10">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
        <h1 className="text-3xl font-semibold">Short link expired</h1>
        <p className="text-muted-foreground">
          {slug ? (
            <>
              The link <span className="font-medium text-foreground">behzod.uk/s/{slug}</span> is no longer active.
            </>
          ) : (
            "This short link is no longer active."
          )}
        </p>
        <p className="text-sm text-muted-foreground">
          Create a fresh short link or reach out to the owner if you need renewed access.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shorten-url"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 hover:shadow-primary/50 transition"
          >
            Build new link
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold hover:border-primary/50 transition"
          >
            Visit homepage
          </Link>
        </div>
      </div>
    </main>
  )
}
