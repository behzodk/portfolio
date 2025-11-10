import type React from "react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SkipToContent } from "@/components/ui/skip-to-content"

export default function ChromeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SkipToContent />
      <Header />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
