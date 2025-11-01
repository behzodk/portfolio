"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

export function CopyButton({ text, label, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleCopy}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors ${className}`}
        aria-label={`Copy ${label || "text"}`}
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        <span>{label || "Copy"}</span>
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none"
          >
            Copied!
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-500 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
