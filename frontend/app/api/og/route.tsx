import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const score = searchParams.get("score") || "88"
  const archetype = searchParams.get("archetype") || "The NPM Hoarder"
  const emoji = searchParams.get("emoji") || "🔥"
  const headline =
    searchParams.get("headline") ||
    "You summoned 42 dependencies just to center a div and leak memory in production."
  const repo = searchParams.get("repo") || "Developer Stack"

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#090a0f",
          backgroundImage:
            "radial-gradient(circle at 90% 10%, rgba(255, 69, 0, 0.25), transparent 45%), radial-gradient(circle at 10% 90%, rgba(220, 38, 38, 0.25), transparent 45%)",
          padding: "60px 70px",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#ff4500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px"
              }}
            >
              🔥
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#ffffff"
                }}
              >
                Roast<span style={{ color: "#ff5722" }}>MyStack</span>
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#71717a",
                  letterSpacing: "2px",
                  textTransform: "uppercase"
                }}
              >
                Brutal Ego-Checker
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "10px 24px"
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#a1a1aa",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}
            >
              Roast Score
            </span>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 900,
                color: "#ff4500"
              }}
            >
              {score}
            </span>
            <span style={{ fontSize: "16px", color: "#52525b" }}>/ 100</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "32px" }}>{emoji}</span>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#fb923c",
                backgroundColor: "rgba(251, 146, 60, 0.1)",
                padding: "6px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(251, 146, 60, 0.2)"
              }}
            >
              {archetype}
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "#a1a1aa",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                padding: "6px 14px",
                borderRadius: "8px"
              }}
            >
              {repo}
            </span>
          </div>

          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#f4f4f5",
              lineHeight: 1.3,
              backgroundColor: "rgba(255, 69, 0, 0.08)",
              borderLeft: "6px solid #ff4500",
              padding: "24px 30px",
              borderRadius: "12px"
            }}
          >
            "{headline}"
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px"
          }}
        >
          <span style={{ fontSize: "16px", color: "#71717a" }}>
            Get your architecture brutally roasted
          </span>
          <span
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#ff5722",
              letterSpacing: "1px"
            }}
          >
            roastmystack.dev
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  )
}
