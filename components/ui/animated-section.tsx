import type React from "react"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
  return <div className={className}>{children}</div>
}
