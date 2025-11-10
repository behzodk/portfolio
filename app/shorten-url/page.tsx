"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Link as LinkIcon,
  Sparkles,
  ShieldCheck,
  Clock3,
  BarChart3,
  CheckCircle2,
  Copy,
  Globe,
} from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { supabase } from "@/lib/supabase-client"

const quickTips = [
  {
    title: "Secure by default",
    description: "Links get HTTPS tracking pixels removed and can be turned off at any time.",
    icon: ShieldCheck,
  },
  {
    title: "Time-box sharing",
    description: "Choose how long a short link stays live — from 1 hour to forever.",
    icon: Clock3,
  },
  {
    title: "Understand engagement",
    description: "Preview click statistics and top referrers right from your dashboard.",
    icon: BarChart3,
  },
]

const workflow = [
  { label: "Drop any URL", detail: "Paste a long link from anywhere — docs, dashboards, campaigns." },
  { label: "Personalize", detail: "Optionally add branded slugs or context tags before sharing." },
  { label: "Share instantly", detail: "Copy the generated short link or send it to your contacts." },
]

const stats = [
  { value: "14s", label: "Avg. setup time" },
  { value: "42%", label: "CTR uplift (est.)" },
  { value: "120d", label: "Analytics window" },
]

const heroChips = ["Branded domains", "UTM guardrails", "One-tap sharing"]

type TemplateConfig = {
  title: string
  description: string
  preset: Partial<FormState>
}

const templates: TemplateConfig[] = [
  {
    title: "Launch Campaign",
    description: "Preset slug patterns, 7 day expiry, UTM locking.",
    preset: { slug: "launch-drop", expiration: "7d", visibility: "public" },
  },
  {
    title: "One-off Drop",
    description: "Single-share links that self-destruct within 24h.",
    preset: { slug: "flash-note", expiration: "24h", visibility: "public" },
  },
  {
    title: "Internal Memo",
    description: "Private visibility with passcode suggestions.",
    preset: { slug: "memo-", visibility: "private", passcode: "team-only" },
  },
]

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
  custom: "Custom window",
}

const calculateExpiryDate = (choice: ExpirationOption, customDays: string): Date | null => {
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


const slugPattern = /^[a-z0-9-]+$/

const generateRandomSlug = () => `link-${Math.random().toString(36).slice(2, 8)}`

const reserveRandomSlug = async (): Promise<string | null> => {
  for (let i = 0; i < 5; i++) {
    const candidate = generateRandomSlug()
    const { data, error } = await supabase.from("short_links").select("slug").eq("slug", candidate).maybeSingle()
    if (!error && !data) {
      return candidate
    }
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

const hostnamePattern = /^([a-z0-9-]+\.)+[a-z]{2,}$/i

const parseDestination = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return { error: "Destination URL is required.", normalized: "" }
  }
  let candidate = trimmed
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`
  }
  try {
    const parsed = new URL(candidate)
    const normalized = parsed.toString()
    const hostname = parsed.hostname
    const looksValid = hostname === "localhost" || hostnamePattern.test(hostname)
    if (!looksValid) {
      return { error: "Enter a full domain like example.com.", normalized: "" }
    }
    return { error: null, normalized }
  } catch (err) {
    return { error: "Enter a valid URL like https://example.com.", normalized: "" }
  }
}

export default function ShortenUrlPage() {
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [createdLink, setCreatedLink] = useState<{
    slug: string
    destination: string
    expiresAt: string | null
    visibility: VisibilityOption
    requirePasscode: boolean
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [destinationTouched, setDestinationTouched] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [isSlugChecking, setIsSlugChecking] = useState(false)
  const [slugExists, setSlugExists] = useState(false)

  const expiresAt = useMemo(() => calculateExpiryDate(formState.expiration, formState.customExpiryDays), [
    formState.expiration,
    formState.customExpiryDays,
  ])

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
      setSlugError("Use lowercase letters, numbers, or hyphens.")
      setIsSlugChecking(false)
      return
    }

    setSlugError(null)
    setIsSlugChecking(true)

    const timer = setTimeout(async () => {
      const { data, error } = await supabase.from("short_links").select("slug").eq("slug", slug).maybeSingle()
      if (cancelled) return

      if (error) {
        setSlugError("Unable to verify this slug. Try again in a moment.")
        setSlugExists(false)
      } else if (data) {
        setSlugError("That slug is already taken.")
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

  const previewSlug = createdLink?.slug ?? (formState.slug || "dev-notes")
  const destinationMeta = useMemo(() => parseDestination(formState.destinationUrl), [formState.destinationUrl])
  const previewDestination =
    createdLink?.destination ?? destinationMeta.normalized ?? "https://example.com/much/longer/path"
  const previewExpiresLabel = createdLink?.expiresAt
    ? new Date(createdLink.expiresAt).toLocaleString()
    : formState.expiration === "custom"
      ? formState.customExpiryDays
        ? `${formState.customExpiryDays}-day window`
        : "Custom window"
      : expirationLabelMap[formState.expiration]
  const previewBadges = createdLink
    ? [
        createdLink.visibility === "public" ? "Public" : "Private",
        createdLink.requirePasscode ? "Passcode" : "Open access",
      ]
    : [
        formState.visibility === "public" ? "Public" : "Private",
        formState.requirePasscode ? "Passcode" : "Open access",
      ]

  const destinationError = destinationTouched ? destinationMeta.error : null
  const isPrivate = formState.visibility === "private"
  const passcodeError = isPrivate && !formState.passcode.trim() ? "Passcode required for private links." : null
  const hasSlugValue = Boolean(formState.slug.trim())
  const slugReady = !slugError && !slugExists && !isSlugChecking
  const destinationReady = !destinationMeta.error
  const passcodeReady = !passcodeError
  const isCreateDisabled = isSubmitting || !destinationReady || !slugReady || !passcodeReady

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyTemplate = (preset: Partial<FormState>) => {
    setStatus(null)
    setFormState((prev) => {
      const nextVisibility = preset.visibility ?? prev.visibility
      const rawSlug = preset.slug ?? prev.slug
      const sanitizedSlug = rawSlug ? sanitizeSlugInput(rawSlug) : prev.slug
      return {
        ...prev,
        ...preset,
        slug: sanitizedSlug,
        visibility: nextVisibility,
        requirePasscode: nextVisibility === "private",
        passcode: nextVisibility === "private" ? (preset.passcode ?? prev.passcode) : "",
      }
    })
    if (preset.slug !== undefined) {
      setSlugTouched(true)
    }
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

    const destinationIssue = destinationMeta.error
    if (destinationIssue) {
      setDestinationTouched(true)
      setStatus({ type: "error", message: destinationIssue })
      return
    }

    if (slugError) {
      setSlugTouched(true)
      setStatus({ type: "error", message: slugError })
      return
    }

    if (slugExists) {
      setStatus({ type: "error", message: "That slug is already taken. Choose another one." })
      return
    }

    if (isSlugChecking) {
      setStatus({ type: "error", message: "Hang tight—still verifying that slug." })
      return
    }

    if (isPrivate && !formState.passcode.trim()) {
      setStatus({ type: "error", message: "Private links need a passcode before they can be saved." })
      return
    }

    if (formState.expiration === "custom") {
      const days = Number(formState.customExpiryDays)
      if (!Number.isFinite(days) || days <= 0) {
        setStatus({ type: "error", message: "Enter how many days the custom window should last." })
        return
      }
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
        },
      ])
      .select("slug,destination_url,expires_at,visibility,require_passcode")
      .single()

    if (error) {
      if (error.code === "23505") {
        setStatus({ type: "error", message: "That slug was just claimed. Try another one." })
      } else {
        setStatus({ type: "error", message: error.message })
      }
      setIsSubmitting(false)
      return
    }

    setCreatedLink({
      slug: data.slug,
      destination: data.destination_url,
      expiresAt: data.expires_at,
      visibility: data.visibility,
      requirePasscode: data.require_passcode,
    })
    setCopied(false)
    setStatus({ type: "success", message: `Short link ${shortDomain}/${data.slug} created in Supabase.` })
    setFormState({ ...initialFormState })
    setDestinationTouched(false)
    setSlugTouched(false)
    setSlugError(null)
    setSlugExists(false)
    setIsSubmitting(false)
  }

  const handleCopyShortLink = async (slug: string) => {
    const shortUrl = `https://${shortDomain}/${slug}`
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setStatus({ type: "error", message: "Unable to copy automatically. Copy the link manually instead." })
    }
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-muted/30">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-y-0 left-1/2 w-[40rem] rounded-full bg-primary/10 blur-3xl opacity-50" />
          <div className="absolute bottom-0 right-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl opacity-60" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <AnimatedSection>
            <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span>Experimental Tooling</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
                  Shorten links that feel intentional — no functionality yet, just the blueprint.
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  A polished interface for the upcoming URL shortener experience. Configure slugs, access windows, and link
                  metadata from a single responsive form.
                </p>
                <div className="flex flex-wrap gap-3">
                  {heroChips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-muted-foreground"
                    >
                      <Globe className="h-4 w-4 text-primary" />
                      {chip}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-border/60 bg-background/80 p-4">
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Builder */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Form */}
          <AnimatedSection className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm space-y-8">
            <header className="space-y-2">
              <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Link builder</p>
              <h2 className="text-3xl font-bold tracking-tight">Design the short link</h2>
              <p className="text-muted-foreground">
                Create production-ready short links in Supabase while the analytics layer is still in progress.
              </p>
            </header>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="destination" className="text-sm font-medium">
                  Destination URL
                </label>
                <input
                  id="destination"
                  type="url"
                  required
                  placeholder="https://example.com/your/long/link"
                  value={formState.destinationUrl}
                  onChange={(event) => handleDestinationChange(event.target.value)}
                  onBlur={() => setDestinationTouched(true)}
                  aria-invalid={destinationError ? "true" : "false"}
                  className={`w-full rounded-xl border bg-background/80 px-4 py-3 text-base focus:outline-none focus:border-primary ${destinationError ? "border-red-500" : "border-border"}`}
                />
                {destinationError ? (
                  <p className="text-xs text-red-500">{destinationError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">We’ll pull metadata for previews in a later pass.</p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium">
                    Custom slug
                  </label>
                  <div className="flex items-center rounded-xl border border-border/60 bg-muted/20 px-3">
                    <span className="text-muted-foreground text-sm">{shortDomain}/</span>
                    <input
                      id="slug"
                      type="text"
                      placeholder="dev-notes"
                      value={formState.slug}
                      onChange={(event) => handleSlugChange(event.target.value)}
                      onBlur={() => setSlugTouched(true)}
                      aria-invalid={slugError ? "true" : "false"}
                      className="flex-1 bg-transparent px-2 py-3 focus:outline-none"
                    />
                  </div>
                  {slugError ? (
                    <p className="text-xs text-red-500">{slugError}</p>
                  ) : isSlugChecking ? (
                    <p className="text-xs text-muted-foreground">Checking availability…</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Use lowercase letters, numbers, or hyphens.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="expiration" className="text-sm font-medium">
                    Expiration
                  </label>
                  <select
                    id="expiration"
                    value={formState.expiration}
                    onChange={(event) => updateForm("expiration", event.target.value as ExpirationOption)}
                    className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 focus:border-primary focus:outline-none"
                  >
                    {Object.entries(expirationLabelMap).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {formState.expiration === "custom" && (
                    <input
                      type="number"
                      min="1"
                      placeholder="Days active"
                      value={formState.customExpiryDays}
                      onChange={(event) => updateForm("customExpiryDays", event.target.value)}
                      className="w-full rounded-xl border border-border/70 bg-background/80 px-4 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Visibility</p>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Configurable</span>
                  </div>
                  <div className="flex gap-2">
                    {(["public", "private"] as VisibilityOption[]).map((option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() =>
                          setFormState((prev) => ({
                            ...prev,
                            visibility: option,
                            requirePasscode: option === "private",
                            passcode: option === "private" ? prev.passcode : "",
                          }))
                        }
                        className={`flex-1 rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                          formState.visibility === option
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/70 text-muted-foreground"
                        }`}
                      >
                        {option === "public" ? "Public" : "Private"}
                      </button>
                    ))}
                  </div>
                  {formState.visibility === "private" && (
                    <>
                      <input
                        type="password"
                        placeholder="Enter passcode"
                        value={formState.passcode}
                        onChange={(event) => updateForm("passcode", event.target.value)}
                        aria-invalid={passcodeError ? "true" : "false"}
                        className={`w-full rounded-xl border bg-background/80 px-3 py-2 text-sm focus:border-primary focus:outline-none ${passcodeError ? "border-red-500" : "border-border/70"}`}
                      />
                      <p className={`text-xs ${passcodeError ? "text-red-500" : "text-muted-foreground"}`}>
                        {passcodeError ?? "Only people with the passcode can open this link."}
                      </p>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Internal note
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="Share context with teammates — campaign, owner, channel, etc."
                    value={formState.note}
                    onChange={(event) => updateForm("note", event.target.value.slice(0, 240))}
                    className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 resize-none focus:border-primary focus:outline-none"
                  />
                  <p className="text-xs text-muted-foreground">{formState.note.length}/240 characters</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Popular templates</p>
                <div className="grid gap-3 md:grid-cols-3">
                  {templates.map((template) => (
                    <button
                      type="button"
                      key={template.title}
                      onClick={() => handleApplyTemplate(template.preset)}
                      className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-left text-sm hover:border-primary/50 transition"
                    >
                      <p className="font-semibold">{template.title}</p>
                      <p className="text-muted-foreground">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={isCreateDisabled}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 disabled:opacity-60"
                >
                  {isSubmitting ? "Creating..." : "Create short link"}
                  <Sparkles className="h-5 w-5" />
                </button>
                <p className="text-sm text-muted-foreground">
                  Entries sync to Supabase immediately — analytics wiring comes next.
                </p>
              </div>
            </form>

            {status && (
              <div
                className={`rounded-2xl border p-4 ${
                  status.type === "success"
                    ? "border-green-500/30 bg-green-500/10 text-green-900 dark:text-green-200"
                    : "border-red-500/30 bg-red-500/10 text-red-900 dark:text-red-200"
                }`}
              >
                {status.message}
              </div>
            )}

            {createdLink && (
              <div className="rounded-2xl border border-border/60 bg-muted/10 p-4 space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Short link ready</p>
                    <p className="text-xl font-semibold">{shortDomain}/{createdLink.slug}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyShortLink(createdLink.slug)}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:border-primary/60"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied" : "Copy link"}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground break-words">
                  Destination: <span className="font-medium text-foreground">{createdLink.destination}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires: {createdLink.expiresAt ? new Date(createdLink.expiresAt).toLocaleString() : "Never"}
                </p>
              </div>
            )}
          </AnimatedSection>

          {/* Preview */}
          <AnimatedSection className="space-y-6">
            <div className="rounded-3xl border border-border/50 bg-muted/20 p-6 shadow-inner">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.4em]">
                {createdLink ? "Latest short link" : "Preview card"}
              </p>
              <div className="mt-6 space-y-4 rounded-2xl border border-border/60 bg-background/80 p-6">
                <div className="flex items-center gap-3">
                  <LinkIcon className="h-10 w-10 rounded-2xl bg-primary/10 p-2 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {shortDomain}/{previewSlug}
                    </p>
                    <p className="text-lg font-semibold">
                      {createdLink ? "Live short link" : "Configuration preview"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground break-words">
                  Will point to <span className="font-medium text-foreground">{previewDestination}</span> with media
                  unfurling enabled.
                </p>
                <div className="flex flex-wrap gap-2">
                  {previewBadges.map((badge) => (
                    <span key={badge} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Expires</p>
                    <p className="font-semibold text-foreground">{previewExpiresLabel}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => createdLink && handleCopyShortLink(previewSlug)}
                    disabled={!createdLink}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:border-primary/60 disabled:opacity-50"
                  >
                    <Copy className="h-4 w-4" />
                    {createdLink ? "Copy live link" : "Create first link"}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/50 bg-card/80 p-6 space-y-6">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">How it will flow</p>
                <div className="mt-4 space-y-4">
                  {workflow.map((step, index) => (
                    <div key={step.label} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{step.label}</p>
                        <p className="text-sm text-muted-foreground">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-muted-foreground">Trust indicators</p>
                <div className="mt-4 grid gap-4">
                  {quickTips.map(({ title, description, icon: IconComponent }) => (
                    <div key={title} className="flex gap-4 rounded-2xl border border-border/60 bg-muted/10 p-4">
                      <IconComponent className="h-10 w-10 flex-shrink-0 rounded-2xl bg-primary/10 p-2 text-primary" />
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-700 dark:text-green-300">Supabase connected</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Form submissions now create rows in <code>short_links</code>. Analytics + dashboards land next.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl border border-border/60 bg-gradient-to-r from-primary/10 via-accent/10 to-transparent p-10 text-center space-y-4">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.3em]">Next Milestone</p>
          <h3 className="text-3xl font-bold">Layer analytics + insights</h3>
          <p className="text-muted-foreground">
            Short links now write to Supabase. Next up: surface click metrics, referrers, and workspace sharing directly
            in this UI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition"
            >
              Monitor Supabase table
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-6 py-3 font-semibold hover:border-primary/50"
            >
              Request access
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
