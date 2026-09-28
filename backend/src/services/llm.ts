import { GoogleGenAI } from "@google/genai";
import { ROAST_SYSTEM_PROMPT } from "../prompts/roast.js";
import type { ParsedStack, RoastOutput } from "../types.js";

function extractFriendlyMessage(err: any): string {
  const raw = err?.message || "";
  const lower = raw.toLowerCase();
  if (
    lower.includes("503") ||
    lower.includes("high demand") ||
    lower.includes("unavailable")
  ) {
    return "Google Gemini AI is currently experiencing temporary high demand (503). Please wait 5-10 seconds and try again.";
  }
  if (
    lower.includes("api_key_invalid") ||
    lower.includes("api key not valid") ||
    lower.includes("api key invalid") ||
    lower.includes("unauthenticated") ||
    lower.includes("permission_denied")
  ) {
    return "Invalid Gemini API key. Please update GEMINI_API_KEY in backend/.env with a valid Google AI Studio key (starts with AIzaSy).";
  }
  if (lower.includes("resource_exhausted") || lower.includes("quota")) {
    return "Gemini API rate limit or quota exceeded. Please wait a moment or check your Google AI Studio quota.";
  }
  try {
    const jsonStart = raw.indexOf("{");
    if (jsonStart !== -1) {
      const parsed = JSON.parse(raw.slice(jsonStart));
      if (parsed?.error?.message) {
        return parsed.error.message;
      }
    }
  } catch {}
  return raw || "Unable to reach Gemini AI service.";
}

export async function generateRoast(stack: ParsedStack): Promise<RoastOutput> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "Missing GEMINI_API_KEY. Please set a valid Gemini API key in backend/.env",
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Analyze this developer stack and roast it according to system instructions:

Repository/Name: ${stack.repoName || "Unnamed Project"}
Frameworks: ${stack.frameworks.join(", ") || "None specified"}
Libraries: ${stack.libraries.join(", ") || "None"}
Database: ${stack.database || "None"}
Styling: ${stack.styling || "None"}
Has TypeScript: ${stack.hasTypeScript}
Has Tests: ${stack.hasTests}
Has Docker: ${stack.hasDocker}
Dependencies count: ${Object.keys(stack.dependencies).length}
Dependencies list: ${Object.keys(stack.dependencies).slice(0, 50).join(", ")}
DevDependencies list: ${Object.keys(stack.devDependencies).slice(0, 30).join(", ")}
Code / Stack Snippet:
${stack.raw.slice(0, 2000)}
`;

  const candidateModels = [
    "gemini-1.5-flash",
    "gemini-3.7-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-flash-latest",
  ];
  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: "user",
              parts: [{ text: `${ROAST_SYSTEM_PROMPT}\n\n${prompt}` }],
            },
          ],
          config: {
            responseMimeType: "application/json",
          },
        });

        const text = response.text;
        if (!text) {
          continue;
        }

        const cleaned = text
          .replace(/```json/gi, "")
          .replace(/```/gi, "")
          .trim();
        return JSON.parse(cleaned) as RoastOutput;
      } catch (err: any) {
        lastError = err;
        const raw = (err?.message || "").toLowerCase();
        if (
          raw.includes("503") ||
          raw.includes("high demand") ||
          raw.includes("unavailable")
        ) {
          await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
          continue;
        }
        break;
      }
    }
  }

  throw new Error(extractFriendlyMessage(lastError));
}
