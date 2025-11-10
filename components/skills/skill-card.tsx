// src/components/skills/skill-card.tsx
"use client"

import { memo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface SkillCardProps {
  category: string
  skills: string[]
  icon: LucideIcon
  gradient: string // e.g. "bg-gradient-to-r from-primary/40 to-teal-400/40"
}

function SkillCardRaw({ category, skills, icon: Icon, gradient }: SkillCardProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="group relative will-change-transform">
      {/* Hover glow: opacity-only for performance */}
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 ${gradient}`}
        style={{ filter: "blur(18px)" }}
        transition={{ duration: 0.35 }}
      />

      {/* Card */}
      <motion.div
        className="relative h-full bg-card border border-border/50 rounded-2xl p-6 backdrop-blur-sm overflow-hidden"
        whileHover={reduceMotion ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{ willChange: "transform" }}
      >
        {/* Decorative corner */}
        <div
          aria-hidden
          className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2`}
        />

        {/* Icon */}
        <motion.div
          className="relative mb-6 inline-flex"
          whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: 3 }}
          transition={{ type: "spring", stiffness: 420, damping: 14 }}
          style={{ willChange: "transform" }}
        >
          <div className={`inline-flex p-3 rounded-xl ${gradient} bg-opacity-10 border border-primary/20`}>
            <Icon className="w-6 h-6 text-primary" aria-hidden />
          </div>
        </motion.div>

        {/* Title */}
        <h3 className="font-bold text-xl mb-4 text-foreground group-hover:text-primary transition-colors">
          {category}
        </h3>

        {/* Chips */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <motion.span
              key={skill}
              whileHover={reduceMotion ? undefined : { scale: 1.06, y: -2 }}
              className="px-3 py-1.5 bg-muted/80 hover:bg-primary/20 border border-border/50 hover:border-primary/50 rounded-lg text-sm font-medium transition-colors cursor-default"
              style={{ willChange: "transform" }}
            >
              {skill}
            </motion.span>
          ))}
        </div>

        {/* Count badge */}
        <div
          className="absolute top-4 right-4 px-2 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary"
        >
          {skills.length}
        </div>
      </motion.div>
    </div>
  )
}

export const SkillCard = memo(SkillCardRaw)
