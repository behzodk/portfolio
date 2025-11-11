"use client"

import type React from "react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { LinkIcon, Plus, Copy, Zap, Lock, Globe, Calendar, Loader2, X, Menu, LogOut, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

type ExpirationOption = "never" | "24h" | "7d" | "30d" | "custom"
type VisibilityOption = "public" | "private"

type FormState = {
  destinationUrl: string
  slug: string
  expiration: ExpirationOption
  customExpiryDays: string
  visibility: VisibilityOption
  requirePasscode: boolean
  passcode: string
  note: string
}

const initialFormState: FormState = {
  destinationUrl: "",
  slug: "",
  expiration: "never",
  customExpiryDays: "",
  visibility: "public",
  requirePasscode: false,
  passcode: "",
  note: "",
}

const shortDomain = "behzod.uk/s"

const expirationLabelMap: Record<ExpirationOption, string> = {
  never: "Never expires",
  "24h": "24 hours",
  "7d": "7 days",
  "30d": "30 days",
  custom: "Custom",
}

const slugPattern = /^[a-z0-9-]+$/
const hostnamePattern = /^([a-z0-9-]+\.)+[a-z]{2,}$/i

const generateRandomSlug = () => `link-${Math.random().toString(36).slice(2, 8)}`

const reserveRandomSlug = async () => {
  for (let i = 0; i < 5; i++) {
    const candidate = generateRandomSlug()
    const { data, error } = await supabase.from("short_links").select("slug").eq("slug", candidate).maybeSingle()
    if (!error && !data) return candidate
  }
  return null
}

const sanitizeSlugInput = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")

const calculateExpiryDate = (choice: ExpirationOption, customDays: string) => {
  const now = new Date()
  switch (choice) {
    case "never":
      return null
    case "24h":
      return new Date(now.getTime() + 24 * 60 * 60 * 1000)
    case "7d":
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    case "30d":
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    case "custom": {
      const days = Number(customDays)
      if (Number.isFinite(days) && days > 0) {
        return new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
      }
      return null
    }
    default:
      return null
  }
}

const parseDestination = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return { error: "Required", normalized: "" }
  let candidate = trimmed
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`
  }
  try {
    const parsed = new URL(candidate)
    const normalized = parsed.toString()
    const hostname = parsed.hostname
    if (hostname !== "localhost" && !hostnamePattern.test(hostname)) {
      return { error: "Invalid domain", normalized: "" }
    }
    return { error: null, normalized }
  } catch {
    return { error: "Invalid URL", normalized: "" }
  }
}

type UserLink = {
  id: string
  slug: string
  destination_url: string
  created_at: string | null
  expires_at: string | null
  visibility: VisibilityOption
}

type VisitRow = {
  id: number
  short_link_id: string
  visited_at: string
  device_type: string | null
  browser: string | null
  location: string | null
  passcode_success: boolean | null
}

export default function ShortenUrlPage() {
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [userLinks, setUserLinks] = useState<UserLink[]>([])
  const [linksLoading, setLinksLoading] = useState(false)
  const [destinationTouched, setDestinationTouched] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [isSlugChecking, setIsSlugChecking] = useState(false)
  const [slugExists, setSlugExists] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastType, setToastType] = useState<"success" | "info">("success")
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)
  const [pendingDeleteSlug, setPendingDeleteSlug] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"links" | "analytics">("links")
  const [selectedAnalyticsLink, setSelectedAnalyticsLink] = useState<string | null>(null)
  const [analyticsVisits, setAnalyticsVisits] = useState<VisitRow[]>([])
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  const expiresAt = useMemo(
    () => calculateExpiryDate(formState.expiration, formState.customExpiryDays),
    [formState.expiration, formState.customExpiryDays],
  )

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null)
      setUserName((data.session?.user.user_metadata?.full_name as string | undefined) ?? null)
    })
    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null)
      setUserName((session?.user.user_metadata?.full_name as string | undefined) ?? null)
    })
    return () => subscription.data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!userId) {
      setUserLinks([])
      return
    }
    setLinksLoading(true)
    supabase
      .from("short_links")
      .select("id,slug,destination_url,created_at,expires_at,visibility")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setUserLinks(data ?? [])
        setLinksLoading(false)
      })
  }, [userId])

  useEffect(() => {
    if (userLinks.length === 0) {
      setSelectedAnalyticsLink(null)
      return
    }
    if (!selectedAnalyticsLink) {
      setSelectedAnalyticsLink(userLinks[0].id)
    }
  }, [userLinks, selectedAnalyticsLink])

  useEffect(() => {
    if (!selectedAnalyticsLink || !userId) {
      setAnalyticsVisits([])
      return
    }
    setAnalyticsLoading(true)
    supabase
      .from("visits")
      .select("id,short_link_id,visited_at,device_type,browser,location,passcode_success")
      .eq("short_link_id", selectedAnalyticsLink)
      .order("visited_at", { ascending: false })
      .then(({ data }) => {
        setAnalyticsVisits(data ?? [])
        setAnalyticsLoading(false)
      })
  }, [selectedAnalyticsLink, userId])

  useEffect(() => {
    const slug = formState.slug.trim()
    let cancelled = false
    if (!slug) {
      setSlugExists(false)
      setSlugError(null)
      setIsSlugChecking(false)
      return
    }
    if (!slugPattern.test(slug)) {
      setSlugExists(false)
      setSlugError("Lowercase, numbers, hyphens only")
      setIsSlugChecking(false)
      return
    }
    setSlugError(null)
    setIsSlugChecking(true)
    const timer = setTimeout(async () => {
      const { data, error } = await supabase.from("short_links").select("slug").eq("slug", slug).maybeSingle()
      if (cancelled) return
      if (error) {
        setSlugError("Unable to verify")
        setSlugExists(false)
      } else if (data) {
        setSlugError("Already taken")
        setSlugExists(true)
      } else {
        setSlugExists(false)
      }
      setIsSlugChecking(false)
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [formState.slug, slugTouched])

  const destinationMeta = useMemo(() => parseDestination(formState.destinationUrl), [formState.destinationUrl])
  const destinationError = destinationTouched ? destinationMeta.error : null
  const isPrivate = formState.visibility === "private"
  const passcodeError = isPrivate && !formState.passcode.trim() ? "Required" : null
  const slugReady = !slugError && !slugExists && !isSlugChecking
  const destinationReady = !destinationMeta.error
  const passcodeReady = !passcodeError
  const isCreateDisabled = isSubmitting || !destinationReady || !slugReady || !passcodeReady
  const analyticsSummary = useMemo(() => {
    const total = analyticsVisits.length
    const passOk = analyticsVisits.filter((v) => v.passcode_success === true).length
    const passFail = analyticsVisits.filter((v) => v.passcode_success === false).length
    const deviceCounts = analyticsVisits.reduce<Record<string, number>>((acc, visit) => {
      const key = visit.device_type ?? "unknown"
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})
    const browserCounts = analyticsVisits.reduce<Record<string, number>>((acc, visit) => {
      const key = visit.browser ?? "unknown"
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})
    const lastVisit = analyticsVisits[0]?.visited_at ?? null
    return { total, passOk, passFail, deviceCounts, browserCounts, lastVisit }
  }, [analyticsVisits])

  const selectedAnalyticsSlug = useMemo(() => {
    if (!selectedAnalyticsLink) return ""
    return userLinks.find((link) => link.id === selectedAnalyticsLink)?.slug ?? ""
  }, [selectedAnalyticsLink, userLinks])

  const deviceDistribution = useMemo(() => {
    return Object.entries(analyticsSummary.deviceCounts).map(([device, count]) => {
      const percent = (count / Math.max(analyticsSummary.total, 1)) * 100
      return (
        <div key={device} className="flex items-center gap-3">
          <span className="text-xs capitalize w-16 text-muted-foreground">{device}</span>
          <div className="flex-1 h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
        </div>
      )
    })
  }, [analyticsSummary.deviceCounts, analyticsSummary.total])

  const browserDistribution = useMemo(() => {
    return Object.entries(analyticsSummary.browserCounts).map(([browser, count]) => {
      const percent = (count / Math.max(analyticsSummary.total, 1)) * 100
      return (
        <div key={browser} className="flex items-center gap-3">
          <span className="text-xs capitalize w-16 text-muted-foreground">{browser}</span>
          <div className="flex-1 h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
        </div>
      )
    })
  }, [analyticsSummary.browserCounts, analyticsSummary.total])

  const formatDate = (value: string | null | undefined) => {
    if (!value) return "Never"
    try {
      return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return "Never"
    }
  }

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleDestinationChange = (value: string) => {
    updateForm("destinationUrl", value)
  }

  const handleSlugChange = (value: string) => {
    setSlugTouched(true)
    updateForm("slug", sanitizeSlugInput(value))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    if (destinationMeta.error) {
      setDestinationTouched(true)
      setStatus({ type: "error", message: destinationMeta.error })
      return
    }
    if (slugError) {
      setSlugTouched(true)
      setStatus({ type: "error", message: slugError })
      return
    }
    if (slugExists) {
      setStatus({ type: "error", message: "Slug already taken" })
      return
    }
    if (isSlugChecking) {
      setStatus({ type: "error", message: "Verifying slug..." })
      return
    }
    if (isPrivate && !formState.passcode.trim()) {
      setStatus({ type: "error", message: "Passcode required" })
      return
    }

    let sanitizedSlug = sanitizeSlugInput(formState.slug)
    const normalizedDestination = destinationMeta.normalized
    setIsSubmitting(true)
    setStatus(null)
    const expiresISO = expiresAt ? expiresAt.toISOString() : null
    if (!sanitizedSlug) {
      sanitizedSlug = (await reserveRandomSlug()) ?? `link-${Date.now().toString(36)}`
    }

    const { data, error } = await supabase
      .from("short_links")
      .insert([
        {
          slug: sanitizedSlug,
          destination_url: normalizedDestination,
          note: formState.note.trim() || null,
          passcode: formState.visibility === "private" ? formState.passcode.trim() : null,
          expires_at: expiresISO,
          visibility: formState.visibility,
          allow_indexing: formState.visibility === "public",
          require_passcode: formState.visibility === "private",
          user_id: userId,
        },
      ])
      .select("slug,destination_url,expires_at,visibility,require_passcode,created_at")
      .single()

    if (error) {
      setStatus({ type: "error", message: error.code === "23505" ? "Slug taken" : error.message })
      setIsSubmitting(false)
      return
    }

    if (userId) {
      // setUserLinks((prev) => [
      //   {
      //     slug: data.slug,
      //     destination_url: data.destination_url,
      //     created_at: data.created_at ?? new Date().toISOString(),
      //     expires_at: data.expires_at,
      //     visibility: data.visibility,
      //   },
      //   ...prev,
      // ])
      setUserLinks((prev) => {
        const newLink: UserLink = {
          id: data.slug,
          slug: data.slug,
          destination_url: data.destination_url,
          created_at: data.created_at ?? new Date().toISOString(),
          expires_at: data.expires_at,
          visibility: data.visibility,
        }
        return [newLink, ...prev]
      })
    }
    setStatus(null)
    setToastType("success")
    setToastMessage(`${shortDomain}/${data.slug} created`)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
    setFormState({ ...initialFormState })
    setDestinationTouched(false)
    setSlugTouched(false)
    setSlugError(null)
    setSlugExists(false)
    setIsSubmitting(false)
    setIsBuilderOpen(false)
  }

  const handleCopyShortLink = async (slug: string) => {
    const shortUrl = `https://${shortDomain}/${slug}`
    try {
      await navigator.clipboard.writeText(shortUrl)
      setToastType("info")
      setToastMessage("Copied to clipboard")
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 2000)
    } catch {
      setStatus({ type: "error", message: "Copy failed" })
    }
  }

  const handleDeleteLink = async (slug: string) => {
    if (!userId) return
    setDeletingSlug(slug)
    const { error } = await supabase.from("short_links").delete().eq("user_id", userId).eq("slug", slug)
    if (error) {
      setStatus({ type: "error", message: "Could not delete link" })
    } else {
      setUserLinks((prev) => prev.filter((link) => link.slug !== slug))
      setToastType("success")
      setToastMessage(`${shortDomain}/${slug} deleted`)
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 3000)
    }
    setDeletingSlug(null)
    setPendingDeleteSlug(null)
  }

  const handleAuthToggle = async () => {
    if (userId) {
      await supabase.auth.signOut()
    } else {
      window.location.href = "/login"
    }
  }

  const totalLinks = userLinks.length
  const thisMonthLinks = userLinks.filter((link) => {
    if (!link.created_at) return false
    const created = new Date(link.created_at)
    const now = new Date()
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {toastVisible && toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg border px-4 py-2 text-sm shadow-lg ${
            toastType === "success"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
              : "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200"
          }`}
        >
          <span className="font-mono">{toastMessage}</span>
          <button
            onClick={() => setToastVisible(false)}
            className={`p-1 ${
              toastType === "success"
                ? "text-green-600 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100"
                : "text-blue-600 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
            }`}
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0 flex flex-col`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">B Link Studio</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/40 transition"
          >
            Home
          </Link>
          <button
            onClick={() => setActiveTab("links")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "links" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/40"
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            Links
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "analytics" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/40"
            }`}
          >
            <Globe className="h-4 w-4" />
            Analytics
          </button>
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          {userName ? (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40">
              <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{userName.split(" ")[0]}</p>
                <p className="text-xs text-muted-foreground">Signed in</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground"></p>
          )}
          <button
            onClick={handleAuthToggle}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary/60 transition"
          >
            <LogOut className="h-4 w-4" />
            {userId ? "Logout" : "Sign in"}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold hidden sm:block">
              {activeTab === "links" ? "Links" : "Analytics"}
            </h1>
            {activeTab === "links" && (
              <button
                onClick={() => setIsBuilderOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                <Plus className="h-4 w-4" />
                New
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
            {activeTab === "links" ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Total links", value: totalLinks, icon: LinkIcon },
                    { label: "This month", value: thisMonthLinks, icon: Calendar },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-card border border-border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
                        </div>
                        <stat.icon className="h-6 w-6 text-muted-foreground opacity-40" />
                      </div>
                    </div>
                  ))}
                </div>

                {status && (
                  <div
                    className={`rounded-lg border p-3 text-sm ${
                      status.type === "success"
                        ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
                        : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-sm                    font-semibold text-foreground">
                      {userLinks.length === 0 ? "No links yet" : "Your links"}
                    </h2>
                    {userLinks.length > 0 && <span className="text-xs text-muted-foreground">{userLinks.length}</span>}
                  </div>

                  {linksLoading ? (
                    <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Loading...</span>
                    </div>
                  ) : userLinks.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-sm text-muted-foreground mb-4">Create your first short link</p>
                      <button
                        onClick={() => setIsBuilderOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition"
                      >
                        <Plus className="h-4 w-4" />
                        Create link
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {userLinks.map((link) => (
                        <div
                          key={link.slug}
                          className="rounded-lg border border-border bg-card p-4 hover:border-primary/40 transition space-y-2"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-mono text-sm font-semibold text-primary">
                                  {shortDomain}/{link.slug}
                                </p>
                                {link.visibility === "private" && <Lock className="h-3 w-3 text-muted-foreground" />}
                                {link.expires_at && new Date(link.expires_at) < new Date() && (
                                  <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-0.5">
                                    Expired
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 truncate">{link.destination_url}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Created {formatDate(link.created_at)} · Expires {formatDate(link.expires_at)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <button
                                onClick={() => handleCopyShortLink(link.slug)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition"
                              >
                                <Copy className="h-3 w-3" />
                                Copy
                              </button>
                              <button
                                onClick={() => setPendingDeleteSlug(link.slug)}
                                disabled={deletingSlug === link.slug}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition disabled:opacity-50"
                              >
                                <Trash2 className="h-3 w-3" />
                                {deletingSlug === link.slug ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <section className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.3em]">Analytics</p>
                    <h2 className="text-xl font-semibold">
                      {selectedAnalyticsLink ? `${shortDomain}/${selectedAnalyticsSlug}` : "Select a link"}
                    </h2>
                  </div>
                  {userLinks.length > 0 && (
                    <select
                      value={selectedAnalyticsLink ?? ""}
                      onChange={(e) => setSelectedAnalyticsLink(e.target.value || null)}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    >
                      {userLinks.map((link) => (
                        <option key={link.id} value={link.id}>
                          {shortDomain}/{link.slug}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {analyticsLoading ? (
                  <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading analytics...</span>
                  </div>
                ) : !selectedAnalyticsLink ? (
                  <p className="text-sm text-muted-foreground">Create a link to view analytics.</p>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        { label: "Total visits", value: analyticsSummary.total },
                        { label: "Passcode success", value: analyticsSummary.passOk },
                        { label: "Passcode fails", value: analyticsSummary.passFail },
                        {
                          label: "Last visit",
                          value: analyticsSummary.lastVisit ? formatDate(analyticsSummary.lastVisit) : "No visits",
                        },
                      ].map((card) => (
                        <div key={card.label} className="rounded-lg border border-border bg-card p-4">
                          <p className="text-xs text-muted-foreground">{card.label}</p>
                          <p className="text-xl font-semibold text-foreground mt-1">{card.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                        <p className="text-sm font-semibold">Device types</p>
                        {deviceDistribution.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No visits yet</p>
                        ) : (
                          deviceDistribution
                        )}
                      </div>
                      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                        <p className="text-sm font-semibold">Browsers</p>
                        {browserDistribution.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No visits yet</p>
                        ) : (
                          browserDistribution
                        )}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                      <p className="text-sm font-semibold">Recent visits</p>
                      {analyticsVisits.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No visits logged yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {analyticsVisits.slice(0, 5).map((visit) => (
                            <div key={visit.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs">
                              <div className="text-muted-foreground">
                                {visit.location || "Unknown location"}
                              </div>
                              <div className="flex gap-4 text-muted-foreground">
                                <span>{visit.device_type ?? "unknown"}</span>
                                <span>{visit.browser ?? "unknown"}</span>
                                <span>{formatDate(visit.visited_at)}</span>
                                <span>{visit.passcode_success === false ? "Failed" : "Success"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </main>

      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg border border-border bg-card shadow-lg p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">New link</h2>
              <button onClick={() => setIsBuilderOpen(false)} className="p-1.5 hover:bg-muted rounded-lg transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Destination</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={formState.destinationUrl}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  onBlur={() => setDestinationTouched(true)}
                  className={`w-full rounded-lg border bg-muted/20 px-3 py-2 text-sm focus:outline-none transition ${
                    destinationError ? "border-red-300 focus:border-red-500" : "border-border focus:border-primary"
                  }`}
                />
                {destinationError && <p className="text-xs text-red-500">{destinationError}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Slug <span className="text-gray-500">(Leave blank to auto-generate)</span></label>
                  <div className="flex items-center border border-border rounded-lg bg-muted/20">
                    <span className="text-xs text-muted-foreground px-3">{shortDomain}/</span>
                    <input
                      type="text"
                      placeholder="link"
                      value={formState.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      onBlur={() => setSlugTouched(true)}
                      className="flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none"
                    />
                  </div>
                  {slugError && <p className="text-xs text-red-500">{slugError}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Expires</label>
                  <select
                    value={formState.expiration}
                    onChange={(e) => updateForm("expiration", e.target.value as ExpirationOption)}
                    className="w-full rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm focus:outline-none"
                  >
                    {Object.entries(expirationLabelMap).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formState.expiration === "custom" && (
                <input
                  type="number"
                  min="1"
                  placeholder="Days"
                  value={formState.customExpiryDays}
                  onChange={(e) => updateForm("customExpiryDays", e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm focus:outline-none"
                />
              )}

              <div className="space-y-2 border-t border-border pt-4">
                <p className="text-sm font-medium">Visibility</p>
                <div className="flex gap-2">
                  {(["public", "private"] as VisibilityOption[]).map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => {
                        updateForm("visibility", option)
                        if (option === "private") updateForm("requirePasscode", true)
                      }}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        formState.visibility === option
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-border"
                      }`}
                    >
                      {option === "public" ? (
                        <span className="flex items-center justify-center gap-1">
                          <Globe className="h-3 w-3" /> Public
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1">
                          <Lock className="h-3 w-3" /> Private
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {formState.visibility === "private" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Passcode</label>
                  <input
                    type="password"
                    placeholder="••••••"
                    value={formState.passcode}
                    onChange={(e) => updateForm("passcode", e.target.value)}
                    className={`w-full rounded-lg border bg-muted/20 px-3 py-2 text-sm focus:outline-none transition ${
                      passcodeError ? "border-red-300 focus:border-red-500" : "border-border focus:border-primary"
                    }`}
                  />
                  {passcodeError && <p className="text-xs text-red-500">{passcodeError}</p>}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Note</label>
                <textarea
                  rows={2}
                  placeholder="Optional context..."
                  value={formState.note}
                  onChange={(e) => updateForm("note", e.target.value.slice(0, 240))}
                  className="w-full rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm resize-none focus:outline-none"
                />
                <p className="text-xs text-muted-foreground text-right">{formState.note.length}/240</p>
              </div>

              <button
                type="submit"
                disabled={isCreateDisabled}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {pendingDeleteSlug && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg border border-border bg-card shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Delete short link</h2>
              <button
                onClick={() => setPendingDeleteSlug(null)}
                className="p-1.5 hover:bg-muted rounded-lg transition"
                aria-label="Close delete dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              {shortDomain}/{pendingDeleteSlug} will be removed permanently. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setPendingDeleteSlug(null)}
                className="px-3 py-2 text-sm rounded-lg border border-border hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLink(pendingDeleteSlug)}
                disabled={deletingSlug === pendingDeleteSlug}
                className="px-3 py-2 text-sm rounded-lg bg-red-500 text-red-50 hover:bg-red-600 transition disabled:opacity-60"
              >
                {deletingSlug === pendingDeleteSlug ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
