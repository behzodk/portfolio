"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

export default function BackgroundScene() {
  const [reduced, setReduced] = useState(false)
  const isWebKit = useMemo(() => {
    if (typeof navigator === "undefined") return false
    const ua = navigator.userAgent
    const isSafari = /Safari/i.test(ua) && !/Chrome|Edg|OPR/i.test(ua)
    const isIOSWebKit = /iPhone|iPad|iPod/i.test(ua)
    return isSafari || isIOSWebKit
  }, [])

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)")
    setReduced(!!mq?.matches)
    const onChange = (e) => setReduced(e.matches)
    mq?.addEventListener?.("change", onChange)
    return () => mq?.removeEventListener?.("change", onChange)
  }, [])

  // --- Cursor parallax (throttled with rAF) ---
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 14 })
  const sy = useSpring(my, { stiffness: 50, damping: 14 })
  const raf = useRef(0)

  useEffect(() => {
    const onMove = (e) => {
      if (raf.current) return
      raf.current = requestAnimationFrame(() => {
        const x = e.clientX - window.innerWidth / 2
        const y = e.clientY - window.innerHeight / 2
        mx.set(x)
        my.set(y)
        raf.current = 0
      })
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [mx, my])

  // Smaller parallax ranges on WebKit
  const range = isWebKit ? 10 : 16
  const layer1x = useTransform(sx, [-600, 600], [-range, range])
  const layer1y = useTransform(sy, [-600, 600], [-(range - 4), range - 4])
  const layer2x = useTransform(sx, [-600, 600], [range - 2, -(range - 2)])
  const layer2y = useTransform(sy, [-600, 600], [range - 4, -(range - 4)])
  const layer3x = useTransform(sx, [-600, 600], [-(range - 6), range - 6])
  const layer3y = useTransform(sy, [-600, 600], [range - 8, -(range - 8)])

  // Animation speeds (gentler on WebKit)
  const gridDuration = isWebKit ? 90 : 60
  const blobScale = reduced ? [] : [1, 1.04, 1]
  const blobDur = isWebKit ? 22 : 18
  const ringDuration = isWebKit ? 160 : 120

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Grid layer (transform translate instead of background-position) */}
      <motion.div
        className="absolute inset-[-200%] will-change-transform transform-gpu"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(120,120,120,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(120,120,120,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
        animate={reduced ? {} : { x: [0, 56], y: [0, 56] }}
        transition={{ duration: gridDuration, repeat: Infinity, ease: "linear" }}
      />

      {/* Aurora blobs (NO blur filters, soft edges via gradient stops) */}
      <motion.div
        className="absolute -top-24 -left-24 h-[40rem] w-[40rem] opacity-40 will-change-transform transform-gpu"
        style={{
          x: layer1x, y: layer1y,
          background:
            "radial-gradient(40rem 40rem at 30% 30%, rgba(59,130,246,0.26) 0%, rgba(59,130,246,0.18) 18%, rgba(59,130,246,0.10) 34%, rgba(59,130,246,0.00) 60%)",
        }}
        animate={reduced ? {} : { scale: blobScale }}
        transition={{ duration: blobDur, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-28 -right-10 h-[36rem] w-[36rem] opacity-35 will-change-transform transform-gpu"
        style={{
          x: layer2x, y: layer2y,
          background:
            "radial-gradient(36rem 36rem at 70% 60%, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.12) 28%, rgba(16,185,129,0.00) 62%)",
        }}
        animate={reduced ? {} : { scale: blobScale }}
        transition={{ duration: blobDur + 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-10 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] opacity-25 will-change-transform transform-gpu"
        style={{
          x: layer3x, y: layer3y,
          background:
            "radial-gradient(28rem 28rem at 50% 20%, rgba(168,85,247,0.20) 0%, rgba(168,85,247,0.10) 32%, rgba(168,85,247,0.00) 65%)",
        }}
        animate={reduced ? {} : { scale: blobScale }}
        transition={{ duration: blobDur - 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Lightweight ring (no mask-image, no blur). It’s just a faint stroked ring. */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 will-change-transform transform-gpu"
        style={{
          width: "110vmax",
          height: "110vmax",
          border: "1px solid rgba(120,120,120,0.12)",
        }}
        animate={reduced ? {} : { rotate: 360 }}
        transition={{ duration: ringDuration, repeat: Infinity, ease: "linear" }}
      />

      {/* (Optional) Grain removed — mix-blend can be costly on Safari. */}
    </div>
  )
}
