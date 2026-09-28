import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import { roastRouter } from "./routes/roast.js";
import { roastsRouter } from "./routes/roasts.js";

dotenv.config();

console.log("Backend initialized");

const app = express();
const PORT = process.env.PORT || 5001;

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "2mb" }));

app.get(["/", "/api"], (req, res) => {
  if (
    req.query.format === "json" ||
    (req.headers.accept &&
      req.headers.accept.includes("application/json") &&
      !req.headers.accept.includes("text/html"))
  ) {
    return res.json({
      status: "ok",
      name: "Roast My Stack API",
      message: "API is running",
      dbState: mongoose.connection.readyState,
      timestamp: new Date().toISOString(),
    });
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Roast My Stack — API</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #090a0f;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 20px;
    }
    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 48px 36px;
      text-align: center;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(34, 197, 94, 0.12);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #4ade80;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 12px #22c55e;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 26px;
      font-weight: 800;
      background: linear-gradient(135deg, #ff4500, #ff8c00);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #a1a1aa;
      font-size: 14px;
      line-height: 1.5;
      margin: 0 0 32px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 24px;
    }
    .item {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #71717a;
    }
    .item span {
      display: block;
      color: #f4f4f5;
      font-size: 14px;
      font-weight: 600;
      margin-top: 4px;
      text-transform: none;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="dot"></span>
      API is running
    </div>
    <h1>Roast My Stack API</h1>
    <p>Backend service is active and ready to ruthlessly roast tech stacks.</p>
    <div class="grid">
      <div class="item">Status<span>Online</span></div>
      <div class="item">Database<span>${mongoose.connection.readyState === 1 ? "Connected" : "In-Memory"}</span></div>
      <div class="item">Uptime<span>Healthy</span></div>
    </div>
  </div>
</body>
</html>`);
});

app.get(["/health", "/api/health"], (_, res) => {
  res.json({
    status: "ok",
    dbState: mongoose.connection.readyState,
    timestamp: new Date().toISOString(),
  });
});

app.use(["/api/roast", "/roast"], roastRouter);
app.use(["/api/roasts", "/roasts"], roastsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found", path: _req.url });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err?.message || "Server error" });
});

if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
  connectDB().then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Roast Backend running on http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  });
}

export default app;
