"use client"

import { useEffect, useState } from "react"
import { Flame, Loader2 } from "lucide-react"

const MESSAGES = [
  "Scanning repository architecture...",
  "Analyzing dependencies and package graph...",
  "Running static code quality diagnostics...",
  "Evaluating tech stack trade-offs and complexity...",
  "Generating real-world AI architectural critique..."
]

export function LoadingRoast() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length)
    }, 2400)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative mx-auto flex max-w-lg flex-col items-center justify-center rounded-2xl border border-orange-500/30 bg-[var(--card)] p-8 text-center shadow-2xl backdrop-blur-xl transition-colors duration-200">
      <div className="relative mb-6 flex size-20 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-orange-600/20" />
        <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30">
          <Flame className="size-9 animate-bounce" />
        </div>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
        <Loader2 className="size-3.5 animate-spin" />
        Architect Brain Heating Up
      </div>

      <p className="mt-5 min-h-[3rem] text-base font-medium text-zinc-800 dark:text-zinc-200 transition-all duration-300">
        "{MESSAGES[index]}"
      </p>

      <div className="mt-6 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
      </div>

      <span className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        Brutal accuracy takes a few seconds. Do not reload.
      </span>
    </div>
  )
}
