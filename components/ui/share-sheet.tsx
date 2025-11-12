"use client"

import { useState } from "react"
import { Share2, Link2, Linkedin, Check, Instagram } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ShareSheetProps {
  url: string
  title: string
  description?: string
}

export function ShareSheet({ url }: ShareSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleShareInstagram = () => {
    const instagramUrl = `https://www.instagram.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`
    window.open(instagramUrl, "_blank", "noopener,noreferrer")
  }

  const handleShareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`
    window.open(linkedInUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
        aria-label="Share"
      >
        <Share2 className="w-4 h-4" /> Share
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <div className="p-2 space-y-1">
                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Link2 className="w-5 h-5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{copied ? "Link copied!" : "Copy link"}</div>
                    <div className="text-xs text-muted-foreground">Share via clipboard</div>
                  </div>
                </button>

                {/* Instagram */}
                <button
                  onClick={handleShareInstagram}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left"
                >
                  <Instagram className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Share on Instagram</div>
                    <div className="text-xs text-muted-foreground">Post to your timeline</div>
                  </div>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={handleShareLinkedIn}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left"
                >
                  <Linkedin className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Share on LinkedIn</div>
                    <div className="text-xs text-muted-foreground">Post to your network</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
