"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"
import { Flame, Award, Skull, ShieldAlert } from "lucide-react"
import { ParsedStack, RoastOutput } from "@/lib/types"
import { StackBadges } from "./StackBadges"
import { ShareBar } from "./ShareBar"

type RoastCardProps = {
  roastId: string
  stack: ParsedStack
  roast: RoastOutput
}

export function RoastCard({ roastId, stack, roast }: RoastCardProps) {
  useEffect(() => {
    if (roast.roastScore >= 80) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#ff4500", "#ff8c00", "#ff0000"]
      })
    }
  }, [roast.roastScore])

  const scoreColor =
    roast.roastScore >= 85
      ? "text-red-600 dark:text-red-500"
      : roast.roastScore >= 70
      ? "text-orange-600 dark:text-orange-500"
      : "text-amber-600 dark:text-amber-500"

  return (
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 dark:border-orange-500/30 bg-white dark:bg-[#11131c] p-6 shadow-xl shadow-zinc-200/60 dark:shadow-2xl dark:shadow-black/60 transition-colors duration-200 md:p-8">
      <div className="absolute -right-24 -top-24 size-72 rounded-full bg-orange-600/10 blur-3xl pointer-events-none hidden dark:block" />
      <div className="absolute -left-24 -bottom-24 size-72 rounded-full bg-red-600/10 blur-3xl pointer-events-none hidden dark:block" />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl" role="img" aria-label="archetype">
              {roast.archetypeEmoji}
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                Stack Archetype
              </span>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white md:text-xl">
                {roast.archetype}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-4 py-2 shadow-xs">
            <Flame className="size-5 text-orange-500" />
            <div className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Roast Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black ${scoreColor}`}>
                  {roast.roastScore}
                </span>
                <span className="text-xs text-zinc-500">/ 100</span>
              </div>
            </div>
          </div>
        </div>

        <StackBadges stack={stack} />

        <div className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50/70 dark:bg-red-500/10 p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <Skull className="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-400" />
            <p className="text-base font-semibold leading-relaxed text-red-950 dark:text-red-200 md:text-lg">
              "{roast.headline}"
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
            <Flame className="size-3.5 text-orange-500" />
            Technical Receipts & Burns
          </h3>

          <div className="grid gap-2.5">
            {roast.burns.map((burn, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-zinc-200/80 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 shadow-xs transition-colors hover:border-orange-400/50 dark:hover:border-orange-500/30"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-500/20 text-xs font-bold text-orange-700 dark:text-orange-400">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-300">
                  {burn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {roast.diagnostics && roast.diagnostics.length > 0 && (
          <div className="flex flex-col gap-2.5 pt-2">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
              <ShieldAlert className="size-3.5 text-amber-500" />
              Architect Diagnostics
            </h3>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {roast.diagnostics.map((diag, i) => {
                const badgeStyle =
                  diag.severity === "critical"
                    ? "border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                    : diag.severity === "high"
                    ? "border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400"
                    : diag.severity === "medium"
                    ? "border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    : "border-zinc-200 dark:border-zinc-500/30 bg-zinc-100 dark:bg-zinc-500/10 text-zinc-700 dark:text-zinc-400"

                return (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-xl border border-zinc-200/80 dark:border-white/5 bg-white dark:bg-white/[0.02] p-3.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                        {diag.label}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${badgeStyle}`}
                      >
                        {diag.severity}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      {diag.critique}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/70 dark:bg-amber-500/10 p-4 shadow-xs">
          <div className="flex items-start gap-2.5">
            <Award className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Backhanded Compliment
              </span>
              <p className="text-xs leading-relaxed text-amber-950 dark:text-amber-200/90 font-medium">
                {roast.backhandedCompliment}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-black/40 p-4 text-center shadow-xs">
          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
            Senior Architect Final Verdict
          </span>
          <p className="mt-1 text-sm font-medium italic text-zinc-800 dark:text-zinc-300">
            "{roast.verdict}"
          </p>
        </div>

        <ShareBar roastId={roastId} roast={roast} repoName={stack.repoName} />
      </div>
    </div>
  )
}
