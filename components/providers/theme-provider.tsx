"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"
type HighContrast = "normal" | "high"

interface ThemeContextType {
  theme: Theme
  highContrast: HighContrast
  toggleTheme: () => void
  toggleHighContrast: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [highContrast, setHighContrast] = useState<HighContrast>("normal")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get saved theme preference
    const savedTheme = localStorage.getItem("theme") as Theme | null
    const savedContrast = localStorage.getItem("highContrast") as HighContrast | null

    // Check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const newTheme = savedTheme || (prefersDark ? "dark" : "light")
    const newContrast = savedContrast || "normal"

    setTheme(newTheme)
    setHighContrast(newContrast)
    applyTheme(newTheme, newContrast)
  }, [])

  const applyTheme = (newTheme: Theme, newContrast: HighContrast) => {
    const html = document.documentElement

    if (newTheme === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }

    if (newContrast === "high") {
      html.classList.add("high-contrast")
    } else {
      html.classList.remove("high-contrast")
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme, highContrast)
  }

  const toggleHighContrast = () => {
    const newContrast = highContrast === "normal" ? "high" : "normal"
    setHighContrast(newContrast)
    localStorage.setItem("highContrast", newContrast)
    applyTheme(theme, newContrast)
  }

  return (
    <ThemeContext.Provider value={{ theme, highContrast, toggleTheme, toggleHighContrast }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
