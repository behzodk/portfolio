// components/background/ClientBackgroundFX.jsx
"use client"

import dynamic from "next/dynamic"

// Dynamically import the component with SSR turned off
const BackgroundFX = dynamic(() => import("./BackgroundFX"), {
  ssr: false,
})

export default function ClientBackgroundFX() {
  return <BackgroundFX />
}