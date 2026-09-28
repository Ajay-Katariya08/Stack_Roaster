import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import { connectDB } from "./db"
import { roastRouter } from "./routes/roast"
import { roastsRouter } from "./routes/roasts"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors({ origin: "*" }))
app.use(express.json({ limit: "2mb" }))

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
