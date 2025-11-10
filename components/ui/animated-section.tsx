"use client"

import type React from "react"

interface AnimatedSectionProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
  return <div className={className}>{children}</div>
}
