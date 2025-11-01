"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, hsl(var(--accent) / 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Interactive spotlight effect */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: "translate(-50%, -50%)",
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            x: [null, Math.random() * window.innerWidth],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}
