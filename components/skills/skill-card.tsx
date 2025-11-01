// src/components/skills/skill-card.tsx
"use client"

import { memo, useMemo } from "react"
import { motion, useReducedMotion, Variants } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface SkillCardProps {
  category: string
  skills: string[]
  icon: LucideIcon
  delay?: number
  gradient: string // e.g. "bg-gradient-to-r from-primary/40 to-teal-400/40"
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
}

const chipContainer: Variants = {
  hidden: {},
  show: (staggerStart = 0) => ({
    transition: {
      delayChildren: staggerStart,
      staggerChildren: 0.04,
    },
  }),
}

const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 4 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
}

function SkillCardRaw({ category, skills, icon: Icon, delay = 0, gradient }: SkillCardProps) {
  const reduceMotion = useReducedMotion()

  // Pre-compute stagger start so all chips enter after the card pops in
  const staggerStart = useMemo(() => (reduceMotion ? 0 : 0.08), [reduceMotion])

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className="group relative will-change-transform"
    >
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
        <motion.div
          className="flex flex-wrap gap-2"
          variants={chipContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          custom={staggerStart}
        >
          {skills.map((skill) => (
            <motion.span
              key={skill}
              variants={chipVariants}
              whileHover={reduceMotion ? undefined : { scale: 1.06, y: -2 }}
              className="px-3 py-1.5 bg-muted/80 hover:bg-primary/20 border border-border/50 hover:border-primary/50 rounded-lg text-sm font-medium transition-colors cursor-default"
              style={{ willChange: "transform" }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        {/* Count badge */}
        <motion.div
          className="absolute top-4 right-4 px-2 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.25, delay: delay + 0.1 }}
        >
          {skills.length}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export const SkillCard = memo(SkillCardRaw)
