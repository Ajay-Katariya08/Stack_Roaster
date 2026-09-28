"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Trophy, Flame, ArrowRight, Eye, ThumbsUp, Crown, Medal, Sparkles, Star } from "lucide-react"
import { RoastRecord } from "@/lib/types"
import { upvoteRoast } from "@/lib/api"

type HallOfFameViewProps = {
  initialRoasts: RoastRecord[]
}

export function HallOfFameView({ initialRoasts }: HallOfFameViewProps) {
  const searchParams = useSearchParams()
  const highlightId = searchParams.get("highlight")
  const [roasts, setRoasts] = useState<RoastRecord[]>(initialRoasts)
  const [upvotedIds, setUpvotedIds] = useState<Record<string, number>>({})

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recent_roasts")
      if (!stored) return
      const recents: RoastRecord[] = JSON.parse(stored)
      if (!Array.isArray(recents) || recents.length === 0) return

      setRoasts((prev) => {
        const existingIds = new Set(prev.map((r) => r._id || r.id))
        const missing = recents.filter((r) => !existingIds.has(r._id || r.id))
        if (missing.length === 0) return prev
        return [...missing, ...prev]
      })
    } catch {}
  }, [])

  useEffect(() => {
    if (!highlightId) return
    const timer = setTimeout(() => {
      const el = document.getElementById(`roast-${highlightId}`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [highlightId, roasts])

  const handleUpvote = async (id: string, current: number) => {
    if (upvotedIds[id] !== undefined) return
    setUpvotedIds((prev) => ({ ...prev, [id]: current + 1 }))
    const res = await upvoteRoast(id)
    if (res !== null) {
      setUpvotedIds((prev) => ({ ...prev, [id]: res }))
    }
  }

  const topThree = roasts.slice(0, 3)
  const listRoasts = roasts.slice(3, 53)

  const highlightedRoast = highlightId
    ? roasts.find((r) => (r._id || r.id) === highlightId)
    : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-500 dark:text-amber-400">
          <Trophy className="size-3.5 text-amber-500 dark:text-amber-400" />
          <span>Hall of Flame</span>
        </div>

        <h1 className="mt-4 text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl">
          The Most Roastable Stacks On Earth
        </h1>
        <p className="mt-3 max-w-lg text-sm text-zinc-600 dark:text-zinc-400">
          Top 3 community stacks pinned at the center podium, followed by the next 50 most devastating tech stacks.
        </p>

        {highlightedRoast && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 shadow-sm animate-pulse">
            <Sparkles className="size-4" />
            <span>Your roast has been immortalized below!</span>
          </div>
        )}
      </div>

      {roasts.length === 0 ? (
        <div className="mt-16 mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-zinc-200 dark:border-white/10 bg-[var(--card)] p-8 text-center shadow-lg transition-colors">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <Flame className="size-7 animate-pulse" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">
            The Hall of Flame is Empty
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            No repositories have been immortalized yet. Be the first brave engineer to submit your architecture.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:brightness-110"
          >
            <span>Roast Your Stack First</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center">
          {topThree.length > 0 && (
            <section className="w-full">
              <div className="mb-6 flex items-center justify-center gap-2 text-center">
                <Crown className="size-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Top 3 Pinned Champions
                </span>
                <Crown className="size-4 text-amber-500" />
              </div>

              <div className="grid gap-5 md:grid-cols-3 max-w-4xl mx-auto items-stretch">
                {topThree.map((record, index) => {
                  const id = record._id || record.id || `top-${index}`
                  const isHighlighted = highlightId === id
                  const upvoteCount = upvotedIds[id] ?? (record.upvotes || 0)
                  const rank = index + 1

                  const rankStyles =
                    rank === 1
                      ? {
                          border: "border-amber-400 dark:border-amber-400/60 ring-2 ring-amber-400/30",
                          badge: "bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-amber-500/20 shadow-md",
                          glow: "bg-amber-500/5",
                          title: "#1 Grand Roast",
                          order: "order-1 md:order-2 md:-translate-y-3"
                        }
                      : rank === 2
                      ? {
                          border: "border-zinc-300 dark:border-zinc-400/40",
                          badge: "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200",
                          glow: "bg-zinc-500/5",
                          title: "#2 Runner Up",
                          order: "order-2 md:order-1"
                        }
                      : {
                          border: "border-amber-700/40 dark:border-amber-600/30",
                          badge: "bg-amber-700/20 text-amber-700 dark:text-amber-400",
                          glow: "bg-orange-500/5",
                          title: "#3 Bronze Roast",
                          order: "order-3 md:order-3"
                        }

                  return (
                    <div
                      key={id}
                      id={`roast-${id}`}
                      className={`group relative flex flex-col justify-between rounded-2xl border ${rankStyles.border} ${rankStyles.glow} ${rankStyles.order} bg-[var(--card)] p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                        isHighlighted ? "ring-4 ring-orange-500" : ""
                      }`}
                    >
                      {isHighlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-3 py-0.5 text-[10px] font-black uppercase text-white shadow-md">
                          Just Created by You
                        </div>
                      )}

                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black ${rankStyles.badge}`}
                          >
                            {rank === 1 ? (
                              <Crown className="size-3.5 fill-current" />
                            ) : (
                              <Medal className="size-3.5" />
                            )}
                            {rankStyles.title}
                          </span>

                          <div className="flex items-center gap-1 rounded-lg bg-orange-500/10 px-2.5 py-1 text-xs font-black text-orange-600 dark:text-orange-400">
                            <Flame className="size-3.5 text-orange-500" />
                            <span>{record.roast.roastScore}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-3xl" role="img" aria-label="archetype">
                            {record.roast.archetypeEmoji}
                          </span>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                              Archetype
                            </span>
                            <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
                              {record.roast.archetype}
                            </h3>
                          </div>
                        </div>

                        <p className="line-clamp-3 text-sm font-semibold italic text-zinc-800 dark:text-zinc-200">
                          "{record.roast.headline}"
                        </p>

                        {record.stackData?.repoName && (
                          <div className="text-[11px] font-mono text-zinc-500 truncate">
                            📦 {record.stackData.repoName}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 border-t border-black/5 dark:border-white/5 pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                            <button
                              onClick={() => handleUpvote(id, record.upvotes || 0)}
                              className="flex items-center gap-1 hover:text-orange-500 transition-colors"
                            >
                              <ThumbsUp className="size-3.5 text-orange-500" />
                              <span>{upvoteCount}</span>
                            </button>
                            <span className="flex items-center gap-1">
                              <Eye className="size-3.5" />
                              <span>{record.viewCount || 0}</span>
                            </span>
                          </div>

                          <Link
                            href={`/roast/${id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 transition-all group-hover:translate-x-0.5"
                          >
                            <span>View Roast</span>
                            <ArrowRight className="size-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {listRoasts.length > 0 && (
            <section className="mt-16 w-full max-w-4xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-orange-500" />
                  <h2 className="text-lg font-black text-zinc-900 dark:text-white">
                    Hall of Flame Leaderboard
                  </h2>
                </div>
                <span className="rounded-full bg-black/5 dark:bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Showing next {listRoasts.length} stacks (Ranks #4 – #{3 + listRoasts.length})
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {listRoasts.map((record, index) => {
                  const id = record._id || record.id || `list-${index}`
                  const isHighlighted = highlightId === id
                  const upvoteCount = upvotedIds[id] ?? (record.upvotes || 0)
                  const rank = index + 4

                  return (
                    <div
                      key={id}
                      id={`roast-${id}`}
                      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-black/10 dark:border-white/10 bg-[var(--card)] p-4 shadow-sm transition-all hover:border-orange-500/40 hover:shadow-md ${
                        isHighlighted
                          ? "ring-2 ring-orange-500 bg-orange-500/10 border-orange-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 text-xs font-black text-zinc-600 dark:text-zinc-400">
                          #{rank}
                        </div>

                        <span className="text-2xl shrink-0" role="img" aria-label="archetype">
                          {record.roast.archetypeEmoji}
                        </span>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                              {record.roast.archetype}
                            </span>
                            {record.stackData?.repoName && (
                              <span className="text-[11px] font-mono text-zinc-500">
                                ({record.stackData.repoName})
                              </span>
                            )}
                            {isHighlighted && (
                              <span className="rounded bg-orange-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-white">
                                Your Roast
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-600 dark:text-zinc-400 italic">
                            "{record.roast.headline}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-black/5 dark:border-white/5 pt-3 sm:pt-0">
                        <div className="flex items-center gap-1 rounded-md bg-orange-500/10 px-2 py-0.5 text-xs font-black text-orange-600 dark:text-orange-400">
                          <Flame className="size-3" />
                          <span>{record.roast.roastScore}</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-zinc-500">
                          <button
                            onClick={() => handleUpvote(id, record.upvotes || 0)}
                            className="flex items-center gap-1 hover:text-orange-500 transition-colors"
                          >
                            <ThumbsUp className="size-3 text-orange-500" />
                            <span>{upvoteCount}</span>
                          </button>
                          <span className="flex items-center gap-1">
                            <Eye className="size-3" />
                            <span>{record.viewCount || 0}</span>
                          </span>
                        </div>

                        <Link
                          href={`/roast/${id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-colors hover:border-orange-500/30 hover:text-orange-500 dark:hover:text-orange-400"
                        >
                          <span>View</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
