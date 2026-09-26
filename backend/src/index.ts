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
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/roast-my-stack"

app.use(cors({ origin: "*" }))
app.use(express.json({ limit: "2mb" }))

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    dbState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  })
})

app.use("/api/roast", roastRouter)
app.use("/api/roasts", roastsRouter)

async function bootstrap() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 20,
      minPoolSize: 2
    })
    console.log("Connected to MongoDB")
  } catch (err: any) {
    console.warn("MongoDB connection warning:", err?.message)
  }

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
}

bootstrap()
