import type { ParsedStack } from "../types.js"

type PackageJson = {
  name?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  scripts?: Record<string, string>
}

export function parsePackageJson(content: string): ParsedStack {
  try {
    const pkg: PackageJson = JSON.parse(content)
    const deps = pkg.dependencies || {}
    const devDeps = pkg.devDependencies || {}
    const allDepKeys = [...Object.keys(deps), ...Object.keys(devDeps)]

    const frameworks: string[] = []
    const libraries: string[] = []

    if (deps["next"] || devDeps["next"]) frameworks.push("Next.js")
    if (deps["react"] || devDeps["react"]) frameworks.push("React")
    if (deps["vue"] || devDeps["vue"]) frameworks.push("Vue")
    if (deps["@angular/core"]) frameworks.push("Angular")
    if (deps["svelte"]) frameworks.push("Svelte")
    if (deps["express"]) frameworks.push("Express")
    if (deps["@nestjs/core"]) frameworks.push("NestJS")
    if (deps["fastify"]) frameworks.push("Fastify")

    let database: string | undefined
    if (deps["mongoose"] || deps["mongodb"]) database = "MongoDB"
    else if (deps["pg"] || deps["postgres"] || deps["@prisma/client"]) database = "PostgreSQL"
    else if (deps["mysql2"] || deps["mysql"]) database = "MySQL"
    else if (deps["redis"] || deps["ioredis"]) database = "Redis"
    else if (deps["@supabase/supabase-js"]) database = "Supabase"
    else if (deps["firebase"]) database = "Firebase"

    let styling: string | undefined
    if (deps["tailwindcss"] || devDeps["tailwindcss"]) styling = "Tailwind CSS"
    else if (deps["styled-components"] || devDeps["styled-components"]) styling = "Styled Components"
    else if (deps["@emotion/react"]) styling = "Emotion"
    else if (deps["bootstrap"]) styling = "Bootstrap"

    const hasTypeScript = Boolean(deps["typescript"] || devDeps["typescript"])
    const hasTests = Boolean(
      deps["jest"] ||
      devDeps["jest"] ||
      deps["vitest"] ||
      devDeps["vitest"] ||
      deps["mocha"] ||
      devDeps["mocha"] ||
      deps["cypress"] ||
      devDeps["cypress"] ||
      deps["@playwright/test"] ||
      devDeps["@playwright/test"]
    )
    const hasLinter = Boolean(deps["eslint"] || devDeps["eslint"] || deps["biome"] || devDeps["biome"])

    const knownLibs = [
      "redux",
      "zustand",
      "recoil",
      "mobx",
      "axios",
      "trpc",
      "graphql",
      "prisma",
      "drizzle-orm",
      "lodash",
      "moment",
      "dayjs",
      "rxjs",
      "framer-motion",
      "zod",
      "webpack",
      "vite",
      "gulp",
      "grunt",
      "jquery"
    ]

    for (const lib of knownLibs) {
      if (allDepKeys.some((k) => k.includes(lib))) {
        libraries.push(lib)
      }
    }

    return {
      raw: content.slice(0, 4000),
      repoName: pkg.name,
      dependencies: deps,
      devDependencies: devDeps,
      frameworks,
      libraries,
      database,
      styling,
      hasTypeScript,
      hasTests,
      hasDocker: false,
      hasLinter
    }
  } catch {
    return parseRawStack(content)
  }
}

export function parseRawStack(text: string): ParsedStack {
  const lower = text.toLowerCase()
  const frameworks: string[] = []
  const libraries: string[] = []

  const frameworkList = ["next.js", "react", "vue", "angular", "svelte", "express", "nestjs", "django", "fastapi", "flask", "spring", "rails", "laravel"]
  for (const fw of frameworkList) {
    if (lower.includes(fw)) frameworks.push(fw)
  }

  const libList = ["redux", "zustand", "prisma", "drizzle", "graphql", "tailwind", "docker", "kubernetes", "redis", "mongodb", "postgres", "mysql", "jquery", "bootstrap"]
  for (const lib of libList) {
    if (lower.includes(lib)) libraries.push(lib)
  }

  let database: string | undefined
  if (lower.includes("mongo")) database = "MongoDB"
  else if (lower.includes("postgres") || lower.includes("pgsql")) database = "PostgreSQL"
  else if (lower.includes("mysql")) database = "MySQL"
  else if (lower.includes("redis")) database = "Redis"

  return {
    raw: text.slice(0, 4000),
    dependencies: {},
    devDependencies: {},
    frameworks,
    libraries,
    database,
    styling: lower.includes("tailwind") ? "Tailwind CSS" : undefined,
    hasTypeScript: lower.includes("typescript") || lower.includes(".ts"),
    hasTests: lower.includes("jest") || lower.includes("vitest") || lower.includes("test"),
    hasDocker: lower.includes("docker"),
    hasLinter: lower.includes("eslint")
  }
}
