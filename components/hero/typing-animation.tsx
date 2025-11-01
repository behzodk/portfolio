// src/components/hero/typing-animation.jsx (or wherever it's located)
"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState } from "react"

// Assuming JS as per your page.jsx, removed TS types
export function TypingAnimation({
  text,
  className = "",
  delay = 0,
  speed = 0.05,
  gradient = false,
}) {
  // We keep these states to support the *existing* cursor logic
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  // Framer Motion values for smooth animation
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const displayedText = useTransform(rounded, (latest) => text.slice(0, latest))

  // This useEffect drives the typing animation
  useEffect(() => {
    // Subscribe to the rounded value and update the currentIndex state
    // This allows the original cursor useEffect to work perfectly
    const unsubscribe = rounded.on("change", (latest) => {
      setCurrentIndex(latest)
    })

    const controls = animate(count, text.length, {
      type: "tween",
      duration: text.length * speed,
      delay: delay,
      ease: "linear", // Linear ease for consistent typing
      onComplete: () => {
        // This logic is from the original component
        setTimeout(() => setShowCursor(false), 500)
      },
    })

    return () => {
      controls.stop()
      unsubscribe()
    }
    // We only want this to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, text.length, speed, delay, rounded])

  // This is the original cursor blink effect, it will now work
  // because we are updating `currentIndex` state via the subscription.
  useEffect(() => {
    if (currentIndex < text.length || showCursor) {
      const interval = setInterval(() => {
        setShowCursor((prev) => !prev)
      }, 530)

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
        {/* We render the motion-driven text */}
        <motion.span>{displayedText}</motion.span>
      </span>
      
      {/* This is the original cursor markup. 
          It blinks by mounting/unmounting based on `showCursor` state.
          When it mounts, it plays its *own* animation.
      */}
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