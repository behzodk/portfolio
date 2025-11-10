"use client"

import { useState } from "react"
import Link from "next/link"
import { LogIn, Loader2, ShieldCheck } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full rounded-3xl border border-border/60 bg-card/80 p-8 shadow-sm space-y-6">
        <div className="space-y-2 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold">Sign in</h1>
          <p className="text-muted-foreground">Use your Google account to continue. No other providers are enabled.</p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition hover:shadow-primary/40 disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogIn className="h-5 w-5" />
          )}
          {isLoading ? "Redirecting…" : "Continue with Google"}
        </button>

        {error && (
          <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        <p className="text-sm text-muted-foreground text-center">
          By signing in you agree to the{" "}
          <Link href="/about" className="text-primary font-medium hover:underline">
            site guidelines
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
