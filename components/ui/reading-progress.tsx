"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(scrollPercent, 100))
    }

    window.addEventListener("scroll", updateProgress)
    updateProgress()

    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div className="h-full bg-primary" style={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
    </motion.div>
  )
}
