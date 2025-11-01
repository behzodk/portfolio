"use client"

import { motion } from "framer-motion"

export default function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Animated grid */}
      <motion.div
        className="absolute inset-[-200%]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(120,120,120,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(120,120,120,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
        animate={{
          backgroundPositionX: ["0px", "56px"],
          backgroundPositionY: ["0px", "56px"],
        }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Aurora blobs */}
      <motion.div
        className="absolute -top-24 -left-24 h-[40rem] w-[40rem] blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.28), rgba(59,130,246,0) 60%)",
        }}
        animate={{ x: [-40, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-16 h-[36rem] w-[36rem] blur-3xl opacity-35"
        style={{
          background:
            "radial-gradient(circle at 70% 60%, rgba(16,185,129,0.24), rgba(16,185,129,0) 60%)",
        }}
        animate={{ x: [20, -20, 10, 0], y: [0, 25, -15, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-10 left-1/2 -translate-x-1/2 h-[30rem] w-[30rem] blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(168,85,247,0.22), rgba(168,85,247,0) 65%)",
        }}
        animate={{ y: [-10, 10, -6, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle rotating ring */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, rgba(59,130,246,0.10), rgba(16,185,129,0.10), rgba(168,85,247,0.10), rgba(59,130,246,0.10))",
          maskImage:
            "radial-gradient(closest-side, transparent 70%, black 72%, transparent 74%)",
          WebkitMaskImage:
            "radial-gradient(closest-side, transparent 70%, black 72%, transparent 74%)",
          filter: "blur(6px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}
