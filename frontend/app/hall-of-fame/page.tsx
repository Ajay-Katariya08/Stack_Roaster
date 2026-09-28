import { Suspense } from "react"
import { Metadata } from "next"
import { Navbar } from "@/components/Navbar"
import { HallOfFameView } from "@/components/HallOfFameView"
import { fetchTopRoasts } from "@/lib/api"

export const metadata: Metadata = {
  title: "Hall of Flame — Top Viral Roasts | AI Roast My Stack",
  description: "Browse the most roastable and devastatingly over-engineered tech stacks on the internet."
}

export default async function HallOfFamePage() {
  const roasts = await fetchTopRoasts(60)

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <Navbar />
      <Suspense fallback={<div className="py-24 text-center text-sm text-zinc-500">Loading Hall of Flame...</div>}>
        <HallOfFameView initialRoasts={roasts} />
      </Suspense>
    </div>
  )
}
