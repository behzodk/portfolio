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

function isPrivateIp(ip: string) {
  // Strip port if present
  const clean = ip.replace(/^\s*\[?([^\]]+)\]?(?::\d+)?\s*$/, "$1")
  // Private IPv4 ranges
  if (/^(10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[0-1])\.|192\.168\.)/.test(clean)) return true
  // IPv6 loopback or unique local
  if (/^(::1|fc00:|fd00:|fe80:)/i.test(clean)) return true
  return false
}

function firstPublicIpFromXff(xff: string | null) {
  if (!xff) return null
  const parts = xff.split(",").map(s => s.trim()).filter(Boolean)
  for (const ip of parts) {
    if (!isPrivateIp(ip)) return ip
  }
  // If all are private, return the first entry
  return parts[0] ?? null
}

export default async function ShortLinkRedirect(props: ShortLinkPageProps) {
  const params = await props.params
  const searchParams = (await props.searchParams) ?? {}

  const supabase = createSupabaseServerClient()
  const hdrs = await headers()

  const detectDevice = (userAgent: string | null) => {
    if (!userAgent) return { device: "unknown", browser: "unknown" }
    const ua = userAgent.toLowerCase()
    let browser = "unknown"
    if (ua.includes("chrome")) browser = "Chrome"
    if (ua.includes("firefox")) browser = "Firefox"
    if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari"
    if (ua.includes("edg")) browser = "Edge"
    if (ua.includes("opera") || ua.includes("opr")) browser = "Opera"
    const device =
      ua.includes("tablet") || ua.includes("ipad")
        ? "tablet"
        : ua.includes("mobi") || ua.includes("android")
          ? "mobile"
          : "desktop"
    return { device, browser }
  }

  const collectVisitorInfo = () => {
    // Prefer the first public address from X Forwarded For
    const xff = hdrs.get("x-forwarded-for")
    let ip = firstPublicIpFromXff(xff)

    // Fallbacks that Vercel may add depending on runtime and region
    if (!ip) ip = hdrs.get("x-real-ip")
    if (!ip) ip = hdrs.get("x-vercel-ip")
    if (!ip) ip = hdrs.get("x-edge-ip")
    if (!ip) ip = null // hide ::1 in local dev

    const city =
      hdrs.get("x-vercel-ip-city") ||
      hdrs.get("cf-ipcity") ||
      ""

    const country =
      hdrs.get("x-vercel-ip-country") ||
      hdrs.get("cf-ipcountry") ||
      ""

    const location = [city, country].filter(Boolean).join(", ") || null
    const detected = detectDevice(hdrs.get("user-agent"))

    return { ip, location, deviceType: detected.device, browser: detected.browser }
  }

  const logVisit = async (shortLinkId: string, passcodeSuccess: boolean | null) => {
    try {
      const info = collectVisitorInfo()
      await supabase.from("visits").insert({
        short_link_id: shortLinkId,
        ip_address: info.ip,
        location: info.location,
        device_type: info.deviceType,
        browser: info.browser,
        passcode_success: passcodeSuccess,
      })
    } catch {
      // ignore logging errors
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
      typeof providedPasscode === "string"
        ? providedPasscode
        : Array.isArray(providedPasscode)
        ? providedPasscode[0]
        : ""

    if (passcode && passcode === data.passcode) {
      await logVisit(data.id, true)
      redirect(data.destination_url)
    }

    const invalidAttempt = Boolean(passcode)

    if (invalidAttempt) {
      await logVisit(data.id, false)
    }

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
          {invalidAttempt && <p className="text-sm text-red-500 text-center">That passcode did not work. Try again.</p>}
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

  await logVisit(data.id, data.require_passcode ? false : true)
  redirect(data.destination_url)
}
