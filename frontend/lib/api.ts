import { ParsedStack, RoastOutput, RoastRecord } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"

export type LiveStats = {
  totalRoasts: number
  totalUpvotes: number
  totalViews: number
}

export async function fetchStats(): Promise<LiveStats> {
  try {
    const res = await fetch(`${API_BASE}/api/roasts/stats`, {
      cache: "no-store"
    })
    if (!res.ok) return { totalRoasts: 0, totalUpvotes: 0, totalViews: 0 }
    return await res.json()
  } catch {
    return { totalRoasts: 0, totalUpvotes: 0, totalViews: 0 }
  }
}

export async function submitRoast(data: {
  inputType: "github" | "paste"
  githubUrl?: string
  code?: string
}): Promise<{ id: string; stackData: ParsedStack; roast: RoastOutput }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/roast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
  } catch (err: any) {
    throw new Error(`Unable to connect to backend server at ${API_BASE}. Ensure the backend is running.`)
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || err.error || "Backend failed to generate AI roast.")
  }

  return await res.json()
}

export async function fetchRoastById(id: string): Promise<RoastRecord | null> {
  try {
    const res = await fetch(`${API_BASE}/api/roasts/${id}`, {
      cache: "no-store"
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchTopRoasts(): Promise<RoastRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/api/roasts/top`, {
      cache: "no-store"
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.roasts || []
  } catch {
    return []
  }
}

export async function upvoteRoast(id: string): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE}/api/roasts/${id}/upvote`, {
      method: "POST"
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.upvotes
  } catch {
    return null
  }
}

export async function recordShare(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/roasts/${id}/share`, {
      method: "POST"
    })
  } catch {}
}
