"use client"

import { motion } from "framer-motion"
import { Code2, Brain, Sparkles, Cpu, Database, GitBranch } from "lucide-react"

const icons = [
  { Icon: Code2, delay: 0 },
  { Icon: Brain, delay: 0.2 },
  { Icon: Sparkles, delay: 0.4 },
  { Icon: Cpu, delay: 0.6 },
  { Icon: Database, delay: 0.8 },
  { Icon: GitBranch, delay: 1 },
]

export function FloatingElements() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, delay }, index) => {
        const angle = (index / icons.length) * Math.PI * 2
        const radius = 40 // percentage
        const x = 50 + radius * Math.cos(angle)
        const y = 50 + radius * Math.sin(angle)

        return (
          <motion.div
            key={index}
            className="absolute opacity-10"
            style={{
              // --- CHANGED --- Round the values to 2 decimal places
              left: `${x.toFixed(2)}%`,
              top: `${y.toFixed(2)}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Icon className="w-16 h-16 md:w-24 md:h-24" />
          </motion.div>
        )
      })}
    </div>
  )
}