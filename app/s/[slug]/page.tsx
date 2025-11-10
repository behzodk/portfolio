import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import { AlertTriangle, Lock } from "lucide-react"
import { createSupabaseServerClient } from "@/lib/supabase-server"

interface ShortLinkPageProps {
  params: Promise<{ slug: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export const dynamic = "force-dynamic"

export default async function ShortLinkRedirect(props: ShortLinkPageProps) {
  const params = await props.params
  const searchParams = (await props.searchParams) ?? {}

  const supabase = createSupabaseServerClient()
  const headersList = await headers()

  const detectDevice = (userAgent: string | null) => {
    if (!userAgent) return "unknown"
    const ua = userAgent.toLowerCase()
    if (ua.includes("tablet") || ua.includes("ipad")) return "tablet"
    if (ua.includes("mobi") || ua.includes("android")) return "mobile"
    return "desktop"
  }

  const collectVisitorInfo = () => {
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
      headersList.get("x-real-ip") ??
      headersList.get("x-vercel-ip") ??
      headersList.get("cf-connecting-ip") ??
      null

    const city = headersList.get("x-vercel-ip-city") ?? headersList.get("cf-ipcity") ?? ""
    const country = headersList.get("x-vercel-ip-country") ?? headersList.get("cf-ipcountry") ?? ""
    const location = [city, country].filter(Boolean).join(", ") || null
    const deviceType = detectDevice(headersList.get("user-agent"))

    return { ip, location, deviceType }
  }

  const logVisit = async (shortLinkId: string) => {
    try {
      const info = collectVisitorInfo()
      await supabase.from("visits").insert({
        short_link_id: shortLinkId,
        ip_address: info.ip,
        location: info.location,
        device_type: info.deviceType,
      })
    } catch (error) {
      // Swallow logging errors
    }
  }

  const { data, error } = await supabase
    .from("short_links")
    .select("id, destination_url, expires_at, require_passcode, passcode, visibility")
    .eq("slug", params.slug)
    .maybeSingle()

  if (error || !data) {
    notFound()
  }

  const now = Date.now()
  if (data.expires_at && new Date(data.expires_at).getTime() < now) {
    redirect(`/shorten-url/expired?slug=${encodeURIComponent(params.slug)}`)
  }

  if (data.require_passcode) {
    const providedPasscode = searchParams?.passcode
    const passcode =
      typeof providedPasscode === "string" ? providedPasscode : Array.isArray(providedPasscode) ? providedPasscode[0] : ""

    if (passcode && passcode === data.passcode) {
      await logVisit(data.id)
      redirect(data.destination_url)
    }

    const invalidAttempt = Boolean(passcode)

    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border border-border/60 bg-card/80 p-8 space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Lock className="h-10 w-10 text-primary" />
            <h1 className="text-2xl font-semibold">Passcode required</h1>
          </div>
          <p className="text-muted-foreground text-center">
            This short link is protected. Ask the owner for the passcode and enter it below to continue.
          </p>
          {invalidAttempt && <p className="text-sm text-red-500 text-center">That passcode didn&apos;t work. Try again.</p>}
          <form className="space-y-4" action={`/s/${params.slug}`} method="GET">
            <input
              type="password"
              name="passcode"
              placeholder="Enter passcode"
              required
              className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-4 py-3 text-primary-foreground font-semibold hover:opacity-90 transition"
            >
              Unlock link
            </button>
          </form>
          <p className="text-xs text-muted-foreground text-center">
            Hint: you can append <code>?passcode=secret</code> to the URL if you already know it.
          </p>
        </div>
      </main>
    )
  }

  await logVisit(data.id)
  redirect(data.destination_url)
}
