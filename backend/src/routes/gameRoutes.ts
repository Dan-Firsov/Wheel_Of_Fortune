import express from "express"
import { createNewGameSession, selectWinner } from "../controllers/gameController"
import { getCurrentGameState } from "../controllers/countsController"

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

router.get("/game-state", async (req, res) => {
  try {
    const gameState = await getCurrentGameState()
    res.status(200).json(gameState)
  } catch (error) {
    console.error("Failed to get game state:", error)
    res.status(500).json({ error: "Failed to get game state" })
  }
})

export default router
