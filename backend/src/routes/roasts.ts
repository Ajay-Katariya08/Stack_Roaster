import { Router } from "express"
import { getRoastById, getStats, getTopRoasts, incrementShare, upvoteRoast } from "../controllers/roastController.js"

export const roastsRouter = Router()

roastsRouter.get("/stats", getStats)
roastsRouter.get("/top", getTopRoasts)
roastsRouter.get("/:id", getRoastById)
roastsRouter.post("/:id/upvote", upvoteRoast)
roastsRouter.post("/:id/share", incrementShare)
