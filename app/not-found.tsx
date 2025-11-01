import Link from "next/link"
import { ArrowRight, Home } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"

export default function NotFound() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <AnimatedSection>
          <div className="space-y-4">
            <h1 className="text-7xl font-bold">404</h1>
            <h2 className="text-4xl font-bold">Page Not Found</h2>
            <p className="text-xl text-muted-foreground">
              Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <Home className="w-4 h-4" /> Back to Home
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
            >
              View Portfolio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="pt-8 border-t border-border">
            <p className="text-muted-foreground mb-4">Or explore these pages:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { href: "/", label: "Home" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/blog", label: "Blog" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-primary hover:underline transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
