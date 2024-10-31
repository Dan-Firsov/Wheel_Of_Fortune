import express from "express"
import { createNewGameSession, selectWinner } from "../controllers/gameController"

const router = express.Router()

router.post("/new-session", async (req, res) => {
  try {
    await createNewGameSession()
    res.status(200).json({ message: "New game session started" })
  } catch (error) {
    res.status(500).json({ error: "Failed to start a new session" })
  }
})

router.post("/select-winner", async (req, res) => {
  try {
    await selectWinner()
    res.status(200).json({ message: "Winner selected" })
  } catch (error) {
    res.status(500).json({ error: "Failed to select a winner" })
  }
})

export default router
