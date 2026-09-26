export type ParsedStack = {
  raw: string
  packageManager?: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  frameworks: string[]
  libraries: string[]
  database?: string
  styling?: string
  hasTypeScript: boolean
  hasTests: boolean
  hasDocker: boolean
  hasLinter: boolean
  repoName?: string
  stars?: number
}

export type RoastOutput = {
  roastScore: number
  archetype: string
  archetypeEmoji: string
  headline: string
  burns: string[]
  backhandedCompliment: string
  verdict: string
  diagnostics: {
    label: string
    severity: "low" | "medium" | "high" | "critical"
    critique: string
  }[]
}
