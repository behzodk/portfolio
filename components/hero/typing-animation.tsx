// src/components/hero/typing-animation.jsx
"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState } from "react"

/**
 * @typedef {Object} TypingProps
 * @property {string} text
 * @property {string} [className]
 * @property {number} [delay]
 * @property {number} [speed]
 * @property {boolean} [gradient]
 */

/** @param {TypingProps} props */
export function TypingAnimation(props) {
  // Destructure *inside* so TS doesn't complain about implicit any on bindings
  const { text, className = "", delay = 0, speed = 0.05, gradient = false } = props

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const displayedText = useTransform(rounded, (latest) => text.slice(0, latest))

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => setCurrentIndex(latest))

    const controls = animate(count, text.length, {
      type: "tween",
      duration: text.length * speed,
      delay,
      ease: "linear",
      onComplete: () => {
        setTimeout(() => setShowCursor(false), 500)
      },
    })

    return () => {
      controls.stop()
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, text.length, speed, delay, rounded])

  useEffect(() => {
    if (currentIndex < text.length || showCursor) {
      const interval = setInterval(() => setShowCursor((prev) => !prev), 530)
      return () => clearInterval(interval)
    }
  }, [currentIndex, text.length, showCursor])

  const textClasses = gradient
    ? "bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent"
    : ""

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className={className}
      aria-label={text}
    >
      <span className={textClasses}>
        <motion.span>{displayedText}</motion.span>
      </span>

      {showCursor && (
        <motion.span
          className={gradient ? "text-primary" : "text-foreground"}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.53, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          |
        </motion.span>
      )}
    </motion.div>
  )
}
