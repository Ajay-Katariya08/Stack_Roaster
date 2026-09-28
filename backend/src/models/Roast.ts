import mongoose, { Schema } from "mongoose"
import type { ParsedStack, RoastOutput } from "../types.js"

export type TRoast = {
  inputType: "github" | "paste"
  githubUrl?: string
  stackData: ParsedStack
  roast: RoastOutput
  shareCount: number
  viewCount: number
  upvotes: number
  createdAt: Date
  updatedAt: Date
}

const RoastSchema = new Schema<TRoast>(
  {
    inputType: { type: String, enum: ["github", "paste"], required: true },
    githubUrl: { type: String },
    stackData: { type: Schema.Types.Mixed, required: true },
    roast: { type: Schema.Types.Mixed, required: true },
    shareCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
)

RoastSchema.index({ createdAt: -1 })
RoastSchema.index({ upvotes: -1 })
RoastSchema.index({ shareCount: -1 })

export const Roast = mongoose.models.Roast || mongoose.model("Roast", RoastSchema)
