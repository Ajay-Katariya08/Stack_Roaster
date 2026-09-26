"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { RoastForm } from "@/components/RoastForm"
import { LoadingRoast } from "@/components/LoadingRoast"
import { RoastCard } from "@/components/RoastCard"
import { fetchStats, LiveStats } from "@/lib/api"
import { ParsedStack, RoastOutput } from "@/lib/types"
import { Flame, TrendingUp, ThumbsUp, Eye, Zap, AlertTriangle } from "lucide-react"

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<LiveStats | null>(null)
  const [result, setResult] = useState<{
    id: string
    stackData: ParsedStack
    roast: RoastOutput
  } | null>(null)

  useEffect(() => {
    fetchStats().then(setStats)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <Navbar />

      <main className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-12 sm:px-6 sm:py-16">
        <div className="absolute top-1/4 -z-10 size-[500px] rounded-full bg-gradient-to-tr from-orange-600/15 via-red-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
            <Flame className="size-3.5 text-orange-500" />
            <span>The Brutal Developer Ego-Checker</span>
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-6xl sm:leading-[1.1]">
            We Roast Your Stack.{" "}
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Zero Mercy.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
            Drop your GitHub repository or paste your package.json.
            Our cynical 20-year principal architect will dissect your bad coding habits, outdated packages, and over-engineered architecture.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-600 dark:text-zinc-400">
            {stats && stats.totalRoasts > 0 ? (
              <>
                <span className="flex items-center gap-1.5 font-medium">
                  <TrendingUp className="size-4 text-orange-500 dark:text-orange-400" />
                  {stats.totalRoasts} {stats.totalRoasts === 1 ? "Stack" : "Stacks"} Roasted
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ThumbsUp className="size-4 text-red-500 dark:text-red-400" />
                  {stats.totalUpvotes} Upvotes
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Eye className="size-4 text-amber-500 dark:text-amber-400" />
                  {stats.totalViews} Views
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1.5 font-medium">
                  <Flame className="size-4 text-orange-500 dark:text-orange-400" />
                  Live Real-Time Scanner
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Zap className="size-4 text-amber-500 dark:text-amber-400" />
                  AI Architect Diagnostics
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mt-10 w-full flex justify-center">
          {result ? (
            <div className="w-full flex flex-col items-center gap-6">
              <RoastCard
                roastId={result.id}
                stack={result.stackData}
                roast={result.roast}
              />
              <button
                onClick={() => {
                  setResult(null)
                  fetchStats().then(setStats)
                }}
                className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-6 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition-all hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
              >
                Roast Another Stack
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              {error && (
                <div className="mb-6 w-full max-w-2xl rounded-2xl border border-red-500/40 bg-red-500/10 p-4 sm:p-5 text-red-600 dark:text-red-400 shadow-lg backdrop-blur-md">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="size-5 shrink-0 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-sm text-red-700 dark:text-red-300">AI Service Alert</p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              {loading && <LoadingRoast />}
              <div className={loading ? "hidden" : "w-full flex justify-center"}>
                <RoastForm
                  onSuccess={(data) => {
                    setLoading(false)
                    setError(null)
                    setResult(data)
                    fetchStats().then(setStats)
                  }}
                  onLoadingChange={(val) => setLoading(val)}
                  onError={(msg) => setError(msg)}
                  onClearError={() => setError(null)}
                />
              </div>
            </div>
          )}
        </div>

        {!result && !loading && (
          <section className="mt-20 w-full border-t border-black/5 dark:border-white/5 pt-12">
            <div className="text-center">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Why Developers Love Getting Roasted
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                It hurts because it's technically accurate.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-black/10 dark:border-white/5 bg-[var(--card)] p-5 shadow-sm">
                <span className="text-2xl">📦</span>
                <h3 className="mt-3 text-sm font-bold text-zinc-900 dark:text-white">Dependency Shaming</h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Calculates how many megabytes of node_modules you loaded for what could have been a 5-line bash script.
                </p>
              </div>

              <div className="rounded-xl border border-black/10 dark:border-white/5 bg-[var(--card)] p-5 shadow-sm">
                <span className="text-2xl">🎯</span>
                <h3 className="mt-3 text-sm font-bold text-zinc-900 dark:text-white">Archetype Classification</h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Tags your engineering identity: from "The Resume-Driven Architect" to "The Tutorial Hell Survivor".
                </p>
              </div>

              <div className="rounded-xl border border-black/10 dark:border-white/5 bg-[var(--card)] p-5 shadow-sm">
                <span className="text-2xl">🔥</span>
                <h3 className="mt-3 text-sm font-bold text-zinc-900 dark:text-white">Auto-Generated OG Cards</h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Generates an eye-catching viral image formatted for instant posting on X, LinkedIn, and Reddit.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="mt-24 border-t border-black/5 dark:border-white/5 py-8 text-center text-xs text-zinc-500 dark:text-zinc-500">
        <p>Built for developers who take code seriously and themselves lightly.</p>
      </footer>
    </div>
  )
}
