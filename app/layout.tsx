import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"

const geistSans = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Behzod Musurmonkulov | AI & Computer Science Student | Behzod Musurmonqulov",
  description:
    "Portfolio of Behzod Musurmonkulov - AI & Computer Science Student. Showcasing projects, research, and technical expertise.",
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico"},
      { url: "/favicon_io/android-chrome-192x192.png",
        sizes: "192x192", type: "image/png" },
      { url: "/favicon_io/android-chrome-512x512.png",
        sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon_io/favicon.ico",
    apple: "/favicon_io/apple-touch-icon.png",
  },
  keywords: ["AI", "Computer Science", "Machine Learning", "Portfolio", "Developer"],
  authors: [{ name: "Behzod Musurmonkulov", url: "behzod.co.uk" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://behzod.co.uk",
    title: "Behzod Musurmonkulov | AI & Computer Science Student",
    description: "Portfolio of Behzod Musurmonkulov - AI & Computer Science Student",
    siteName: "Behzod Portfolio",
  }
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
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
