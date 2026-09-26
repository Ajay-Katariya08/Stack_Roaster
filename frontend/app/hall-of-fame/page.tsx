import { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { HallOfFameCard } from "@/components/HallOfFameCard"
import { fetchTopRoasts } from "@/lib/api"
import { Trophy, Flame, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Hall of Flame — Top Viral Roasts | AI Roast My Stack",
  description: "Browse the most roastable and devastatingly over-engineered tech stacks on the internet."
}

export default async function HallOfFamePage() {
  const roasts = await fetchTopRoasts()

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-500 dark:text-amber-400">
            <Trophy className="size-3.5 text-amber-500 dark:text-amber-400" />
            <span>Hall of Flame</span>
          </div>

          <h1 className="mt-4 text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl">
            The Most Roastable Stacks On Earth
          </h1>
          <p className="mt-3 max-w-lg text-sm text-zinc-600 dark:text-zinc-400">
            Real community tech stacks, ranked by senior architect brutality and developer upvotes.
          </p>
        </div>

        {roasts.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {roasts.map((record) => (
              <HallOfFameCard key={record._id || record.id} record={record} />
            ))}
          </div>
        ) : (
          <div className="mt-16 mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-zinc-200 dark:border-white/10 bg-[var(--card)] p-8 text-center shadow-lg transition-colors">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <Flame className="size-7 animate-pulse" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">
              The Hall of Flame is Empty
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              No repositories have been immortalized yet. Be the first brave engineer to submit your architecture and claim your badge of dishonor.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:brightness-110"
            >
              <span>Roast Your Stack First</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
