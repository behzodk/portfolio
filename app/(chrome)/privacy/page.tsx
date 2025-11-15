"use client"

import Link from "next/link"

const listItem = "pl-4 list-disc text-muted-foreground"

export default function PrivacyPolicyPage() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Privacy Policy</p>
          <h1 className="text-4xl font-bold">How we handle your data</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </header>

        <article className="space-y-10 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Overview</h2>
            <p>
              This privacy policy explains how Behzod Musurmonkulov (“we”, “us”, “our”) collects, uses, and protects your
              information when you sign in with Google to use features such as the URL shortener accessible at{" "}
              <code className="px-1 py-0.5 rounded bg-muted text-foreground text-xs">behzod.uk/s</code>. We only request
              information that enables secure sign-in and personalized sessions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Data we access</h2>
            <p>When you authenticate with Google via Supabase, we receive only the following profile details:</p>
            <ul className="space-y-2">
              <li className={listItem}>Email address (used as your unique identifier)</li>
              <li className={listItem}>Display name (first and last name)</li>
              <li className={listItem}>Profile photo URL</li>
            </ul>
            <p>We do not receive or store your Google password, contacts, calendar, files, or any other Google data.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. How we use this information</h2>
            <ul className="space-y-2">
              <li className={listItem}>Authenticating you and maintaining a secure Supabase session.</li>
              <li className={listItem}>Displaying your first name and avatar within the interface.</li>
              <li className={listItem}>Associating resources you create (e.g., short URLs) with your account.</li>
              <li className={listItem}>Providing support signals if you contact us for assistance.</li>
            </ul>
            <p>We do not sell or share this information with advertisers or third parties.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Storage & security</h2>
            <p>
              Authentication is powered by Supabase, which stores session tokens securely. Application data (such as short
              URLs) is stored in Supabase Postgres with row-level security. We apply standard security controls including
              HTTPS, access logs, and restrictive API keys.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Cookies & local storage</h2>
            <p>
              Supabase Auth sets cookies/local storage entries to keep you signed in. These tokens only contain session
              metadata issued by Supabase and can be cleared by signing out or deleting browser data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Retention & deletion</h2>
            <ul className="space-y-2">
              <li className={listItem}>Sessions persist until you sign out or the token expires.</li>
              <li className={listItem}>
                You may request deletion of your account-associated data (short links, profile reference) by emailing
                <Link href="mailto:contact@behzod.uk" className="text-primary font-medium px-1">
                  contact@behzod.uk
                </Link>
                .
              </li>
              <li className={listItem}>Logs and backups may retain minimal metadata for up to 30 days.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Your choices</h2>
            <ul className="space-y-2">
              <li className={listItem}>Use Google sign-in to access the URL shortener.</li>
              <li className={listItem}>Sign out at any time via the header controls.</li>
              <li className={listItem}>Request access or deletion of your data via the contact page or email.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Changes to this policy</h2>
            <p>
              We may update this document as the product evolves. Revisions will be posted on this page with an updated
              effective date. Continued use signifies acceptance of the changes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
            <p>
              Questions or privacy requests? Reach out at{" "}
              <Link href="mailto:contact@behzod.uk" className="text-primary font-medium">
                contact@behzod.uk
              </Link>{" "}
              or through the <Link href="/contact" className="text-primary font-medium hover:underline">contact page</Link>.
            </p>
          </section>
        </article>
      </div>
    </section>
  )
}
