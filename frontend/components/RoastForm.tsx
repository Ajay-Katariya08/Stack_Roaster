"use client"

import { useState } from "react"
import { FileCode, Flame, ArrowRight, AlertTriangle } from "lucide-react"
import { GithubIcon } from "./Icons"
import { submitRoast } from "@/lib/api"
import { ParsedStack, RoastOutput } from "@/lib/types"

const SAMPLES = [
  {
    label: "Next.js Overkill",
    code: JSON.stringify(
      {
        name: "micro-saas-starter",
        dependencies: {
          next: "16.3.6",
          react: "19.0.0",
          tailwindcss: "4.0.0",
          prisma: "6.0.0",
          "@trpc/server": "11.0.0",
          redux: "5.0.0",
          zustand: "5.0.0",
          axios: "1.7.0",
          lodash: "4.17.21",
          moment: "2.30.1"
        },
        devDependencies: {
          typescript: "5.7.0",
          eslint: "9.0.0"
        }
      },
      null,
      2
    )
  },
  {
    label: "Classic MERN Spaghetti",
    code: JSON.stringify(
      {
        name: "ecommerce-backend",
        dependencies: {
          express: "4.18.2",
          mongoose: "8.0.0",
          cors: "2.8.5",
          dotenv: "16.3.1",
          jsonwebtoken: "9.0.2",
          bcrypt: "5.1.1",
          multer: "1.4.5"
        },
        devDependencies: {
          nodemon: "3.0.0"
        }
      },
      null,
      2
    )
  },
  {
    label: "jQuery 2016 Survivor",
    code: JSON.stringify(
      {
        name: "legacy-portal",
        dependencies: {
          jquery: "3.2.1",
          bootstrap: "3.3.7",
          lodash: "3.10.1",
          moment: "2.10.6"
        },
        devDependencies: {
          gulp: "3.9.1",
          grunt: "1.0.4"
        }
      },
      null,
      2
    )
  }
]

type RoastFormProps = {
  onSuccess: (data: { id: string; stackData: ParsedStack; roast: RoastOutput }) => void
  onLoadingChange: (loading: boolean) => void
  onError?: (err: string) => void
  onClearError?: () => void
}

export function RoastForm({ onSuccess, onLoadingChange, onError, onClearError }: RoastFormProps) {
  const [tab, setTab] = useState<"github" | "paste">("github")
  const [githubUrl, setGithubUrl] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    onClearError?.()

    if (tab === "github") {
      if (!githubUrl.trim()) {
        const msg = "Please enter a valid GitHub repository URL."
        setError(msg)
        onError?.(msg)
        return
      }
      if (!githubUrl.includes("github.com/")) {
        const msg = "URL must be a public repository on github.com (e.g. github.com/owner/repo)."
        setError(msg)
        onError?.(msg)
        return
      }
    } else {
      if (!code.trim()) {
        const msg = "Please paste your package.json or describe your tech stack."
        setError(msg)
        onError?.(msg)
        return
      }
    }

    try {
      setIsLoading(true)
      onLoadingChange(true)

      const result = await submitRoast({
        inputType: tab,
        githubUrl: tab === "github" ? githubUrl.trim() : undefined,
        code: tab === "paste" ? code.trim() : undefined
      })

      onSuccess(result)
    } catch (err: any) {
      const msg = err?.message || "Failed to generate roast. Try again."
      setError(msg)
      onError?.(msg)
      setIsLoading(false)
      onLoadingChange(false)
    }
  }

  const handleLoadSample = (sampleCode: string) => {
    setTab("paste")
    setCode(sampleCode)
    setError("")
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--card)] p-5 shadow-xl backdrop-blur-xl transition-colors duration-200 sm:p-7">
      <div className="flex border-b border-black/5 dark:border-white/10 pb-4">
        <button
          type="button"
          onClick={() => {
            setTab("github")
            setError("")
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all ${
            tab === "github"
              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md shadow-orange-500/20"
              : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
          }`}
        >
          <GithubIcon className="size-4" />
          GitHub Repository
        </button>

        <button
          type="button"
          onClick={() => {
            setTab("paste")
            setError("")
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all ${
            tab === "paste"
              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md shadow-orange-500/20"
              : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
          }`}
        >
          <FileCode className="size-4" />
          Paste package.json
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        {tab === "github" ? (
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Repository URL
            </label>
            <div className="relative mt-2">
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/facebook/react"
                className="w-full rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-50 dark:bg-black/50 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              Works on public repositories. We'll scan dependencies, Dockerfiles, and test configs.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                package.json or Stack Description
              </label>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                <span>Try sample:</span>
                {SAMPLES.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => handleLoadSample(s.code)}
                    className="rounded bg-zinc-100 dark:bg-white/5 px-2 py-0.5 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 hover:text-orange-500"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative mt-2">
              <textarea
                rows={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder='{\n  "dependencies": {\n    "next": "16.3.6",\n    "mongoose": "9.1.0"\n  }\n}'
                className="w-full rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-50 dark:bg-black/50 p-3.5 font-mono text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-600 dark:text-red-400">
            <AlertTriangle className="size-4 shrink-0 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">AI Roast Failed</p>
              <p className="mt-0.5 text-zinc-700 dark:text-zinc-300 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/25 transition-all hover:brightness-110 disabled:opacity-50"
        >
          <Flame className="size-4 animate-pulse text-white" />
          <span>Roast My Architecture</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>
    </div>
  )
}
