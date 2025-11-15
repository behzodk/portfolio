import type { ReactNode } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SkipToContent } from "@/components/ui/skip-to-content"

interface ChromeLayoutProps {
  children: ReactNode
}

export default function ChromeLayout({ children }: ChromeLayoutProps) {
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
