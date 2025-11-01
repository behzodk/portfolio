"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { useRef } from "react"

export default function Magnetic({ children, className, strength = 0.2 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 120, damping: 10 })
  const sy = useSpring(y, { stiffness: 120, damping: 10 })

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const relX = e.clientX - (r.left + r.width / 2)
    const relY = e.clientY - (r.top + r.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
  }

  const reset = () => {
    x.set(0); y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  )
}
