"use client"

import { motion } from "framer-motion"

const snippets = [
  { code: "const ai = new Intelligence()", position: { top: "15%", left: "10%" } },
  { code: "model.train(data)", position: { top: "25%", right: "15%" } },
  { code: "predict(input)", position: { bottom: "20%", left: "15%" } },
  { code: "optimize()", position: { bottom: "30%", right: "10%" } },
]

export function CodeSnippets() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none hidden lg:block">
      {snippets.map((snippet, index) => (
        <motion.div
          key={index}
          className="absolute font-mono text-xs md:text-sm text-muted-foreground/30 bg-muted/20 backdrop-blur-sm px-3 py-2 rounded border border-border/20"
          style={snippet.position}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            delay: index * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {snippet.code}
        </motion.div>
      ))}
    </div>
  )
}
