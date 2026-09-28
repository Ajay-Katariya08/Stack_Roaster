import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || (!process.env.VERCEL ? "mongodb://localhost:27017/roast-my-stack" : "")

let isConnected = false
let connectPromise: Promise<void> | null = null

export async function connectDB(): Promise<void> {
  if (isConnected || mongoose.connection.readyState === 1) return
  if (!MONGODB_URI) return
  if (connectPromise) return connectPromise

  connectPromise = (async () => {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
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
