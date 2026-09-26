"use client"

import Link from "next/link"
import { Flame, Trophy } from "lucide-react"
import { GithubIcon } from "./Icons"
import { ThemeToggle } from "./ThemeToggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/5 bg-[var(--background)]/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/20 transition-transform duration-200 group-hover:scale-105">
            <Flame className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-zinc-900 dark:text-white text-base">
              Roast<span className="text-orange-500">MyStack</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Ego-Checker
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/hall-of-fame"
            className="flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
          >
            <Trophy className="size-4 text-amber-500 dark:text-amber-400" />
            <span>Hall of Flame</span>
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:border-black/20 dark:hover:border-white/20 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
          >
            <GithubIcon className="size-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
