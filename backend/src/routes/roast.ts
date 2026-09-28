import { Router } from "express"
import { createRoast } from "../controllers/roastController.js"

export const roastRouter = Router()

roastRouter.post("/", createRoast)
