import "./patch"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import { roastRouter } from "./routes/roast"
import { roastsRouter } from "./routes/roasts"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001
const MONGODB_URI = process.env.MONGODB_URI || (!process.env.VERCEL ? "mongodb://localhost:27017/roast-my-stack" : "")

app.use(cors({ origin: "*" }))
app.use(express.json({ limit: "2mb" }))

let isConnected = false
let connectPromise: Promise<void> | null = null

async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) return
  if (!MONGODB_URI) return
  if (connectPromise) return connectPromise

  connectPromise = (async () => {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 2500,
        connectTimeoutMS: 2500,
        socketTimeoutMS: 2500,
        bufferCommands: false
      })
      isConnected = true
    } catch (err: any) {
      console.warn("MongoDB connection warning:", err?.message)
    } finally {
      connectPromise = null
    }
  })()

  return connectPromise
}

app.use(async (_req, _res, next) => {
  try {
    await Promise.race([
      connectDB(),
      new Promise((resolve) => setTimeout(resolve, 1500))
    ])
  } catch {}
  next()
})

app.get(["/", "/api"], (_, res) => {
  res.json({
    status: "ok",
    name: "AI Roast My Stack API",
    dbState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  })
})

app.get(["/health", "/api/health"], (_, res) => {
  res.json({
    status: "ok",
    dbState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  })
})

app.use(["/api/roast", "/roast"], roastRouter)
app.use(["/api/roasts", "/roasts"], roastsRouter)

if (!process.env.VERCEL) {
  connectDB().then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Roast Backend running on http://localhost:${PORT}`)
    })

    const shutdown = async () => {
      server.close(async () => {
        await mongoose.disconnect()
        process.exit(0)
      })
    }

    process.on("SIGINT", shutdown)
    process.on("SIGTERM", shutdown)
  })
}

export default app
