import Link from "next/link"
import { Flame, Eye, ThumbsUp, ArrowRight } from "lucide-react"
import { RoastRecord } from "@/lib/types"

type HallOfFameCardProps = {
  record: RoastRecord
}

export function HallOfFameCard({ record }: HallOfFameCardProps) {
  const { roast, stackData } = record
  const id = record._id || record.id

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-[var(--card)] p-5 shadow-sm dark:shadow-lg transition-all hover:border-orange-500/40 hover:shadow-orange-500/10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{roast.archetypeEmoji}</span>
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
              {roast.archetype}
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-md bg-orange-500/10 px-2 py-0.5 text-xs font-black text-orange-600 dark:text-orange-400">
            <Flame className="size-3" />
            <span>{roast.roastScore}</span>
          </div>
        </div>

        <p className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-200">
          "{roast.headline}"
        </p>

        {stackData?.repoName && (
          <span className="text-[11px] font-mono text-zinc-500">
            {stackData.repoName}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-3">
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <ThumbsUp className="size-3 text-orange-500 dark:text-orange-400" />
            {record.upvotes || 0}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="size-3" />
            {record.viewCount || 0}
          </span>
        </div>

        <Link
          href={`/roast/${id}`}
          className="flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400 transition-transform group-hover:translate-x-1"
        >
          View Roast
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  )
}
