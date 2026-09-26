import { Router } from "express"
import { createRoast } from "../controllers/roastController"

export const roastRouter = Router()

roastRouter.post("/", createRoast)
