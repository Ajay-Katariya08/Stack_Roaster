import { ParsedStack } from "@/lib/types"
import { CheckCircle2, XCircle, Code2, Database, Layers } from "lucide-react"

type StackBadgesProps = {
  stack: ParsedStack
}

export function StackBadges({ stack }: StackBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {stack.repoName && (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-2.5 py-1 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 shadow-xs">
          <Code2 className="size-3.5 text-zinc-500 dark:text-zinc-400" />
          {stack.repoName}
        </span>
      )}

      {stack.frameworks.map((fw) => (
        <span
          key={fw}
          className="inline-flex items-center gap-1 rounded-md border border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300 shadow-xs"
        >
          <Layers className="size-3 text-orange-500 dark:text-orange-400" />
          {fw}
        </span>
      ))}

      {stack.database && (
        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-xs"
        >
          <Database className="size-3 text-emerald-600 dark:text-emerald-400" />
          {stack.database}
        </span>
      )}

      {stack.styling && (
        <span className="inline-flex items-center gap-1 rounded-md border border-sky-200 dark:border-sky-500/20 bg-sky-50 dark:bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300 shadow-xs"
        >
          <Layers className="size-3 text-sky-500 dark:text-sky-400" />
          {stack.styling}
        </span>
      )}

      <span
        className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold shadow-xs ${
          stack.hasTypeScript
            ? "border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
            : "border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300"
        }`}
      >
        {stack.hasTypeScript ? "TypeScript" : "Plain JS"}
      </span>

      <span
        className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold shadow-xs ${
          stack.hasTests
            ? "border-emerald-200 dark:border-green-500/20 bg-emerald-50 dark:bg-green-500/10 text-emerald-700 dark:text-green-300"
            : "border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300"
        }`}
      >
        {stack.hasTests ? (
          <>
            <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" /> Tests Found
          </>
        ) : (
          <>
            <XCircle className="size-3 text-red-600 dark:text-red-400" /> Zero Tests
          </>
        )}
      </span>
    </div>
  )
}
