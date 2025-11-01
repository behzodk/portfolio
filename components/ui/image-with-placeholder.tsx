"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageWithPlaceholderProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export function ImageWithPlaceholder({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: ImageWithPlaceholderProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoadingComplete={() => setIsLoading(false)}
        className={cn("w-full h-full object-cover transition-opacity duration-300", isLoading && "opacity-0")}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10 animate-pulse" />
      )}
    </div>
  )
}
