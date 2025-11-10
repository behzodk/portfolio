import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SkipToContent } from "@/components/ui/skip-to-content"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Behzod Musurmonkulov | AI & Computer Science Student",
  description:
    "Portfolio of Behzod Musurmonkulov - AI & Computer Science Student. Showcasing projects, research, and technical expertise.",
  generator: "Next.js",
  keywords: ["AI", "Computer Science", "Machine Learning", "Portfolio", "Developer"],
  authors: [{ name: "Behzod Musurmonkulov" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://behzod-portfolio.com",
    title: "Behzod Musurmonkulov | AI & Computer Science Student",
    description: "Portfolio of Behzod Musurmonkulov - AI & Computer Science Student",
    siteName: "Behzod Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Behzod Musurmonkulov | AI & Computer Science Student",
    description: "Portfolio of Behzod Musurmonkulov - AI & Computer Science Student",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning className={`${geistSans.className} antialiased`}>
        <ThemeProvider>
          <SkipToContent />
          <Header />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
