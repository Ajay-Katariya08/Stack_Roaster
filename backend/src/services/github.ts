import { Octokit } from "@octokit/rest"
import type { ParsedStack } from "../types.js"
import { parsePackageJson, parseRawStack } from "./parser.js"

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || undefined
})

export type GitHubRepoInfo = {
  owner: string
  repo: string
}

export function parseGitHubUrl(url: string): GitHubRepoInfo | null {
  try {
    const cleaned = url.trim().replace(/\/$/, "")
    const match = cleaned.match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/)
    if (!match || !match[1] || !match[2]) return null
    return { owner: match[1], repo: match[2] }
  } catch {
    return null
  }
}

export async function fetchRepoStack(owner: string, repo: string): Promise<ParsedStack> {
  let stars = 0
  try {
    const repoData = await octokit.rest.repos.get({ owner, repo })
    stars = repoData.data.stargazers_count
  } catch {}

  const filesToCheck = [
    "package.json",
    "requirements.txt",
    "go.mod",
    "Cargo.toml",
    "Dockerfile",
    "docker-compose.yml",
    "README.md"
  ]

  let packageJsonContent: string | null = null
  let readmeSnippet = ""
  let hasDocker = false

  for (const path of filesToCheck) {
    try {
      const res = await octokit.rest.repos.getContent({
        owner,
        repo,
        path
      })

      if ("content" in res.data && typeof res.data.content === "string") {
        const decoded = Buffer.from(res.data.content, "base64").toString("utf-8")
        if (path === "package.json") {
          packageJsonContent = decoded
        } else if (path.includes("Docker")) {
          hasDocker = true
        } else if (path === "README.md") {
          readmeSnippet = decoded.slice(0, 1500)
        }
      }
    } catch {}
  }

  if (packageJsonContent) {
    const parsed = parsePackageJson(packageJsonContent)
    parsed.repoName = `${owner}/${repo}`
    parsed.stars = stars
    parsed.hasDocker = hasDocker || parsed.hasDocker
    if (readmeSnippet) {
      parsed.raw += `\n\n--- README preview ---\n${readmeSnippet}`
    }
    return parsed
  }

  return {
    ...parseRawStack(`${owner}/${repo}\n${readmeSnippet}`),
    repoName: `${owner}/${repo}`,
    stars,
    hasDocker
  }
}
