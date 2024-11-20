import { getContract } from "../config/contract"
import { updateGameState } from "../controllers/countsController"
import { createNewGameSession, selectWinner } from "../controllers/gameController"
import { startGameTimer, startNewSessionTimer } from "../controllers/timerController"
import { eventEmitter } from "../events/gameEvents"
import { formatEther } from "ethers"

export function initializeEventSubscriptions() {
  const contract = getContract()
  console.log(`Contract info:  ${contract}`)

  if (!contract) {
    throw new Error("Contract is not initialized before subscribing to events.")
  }

  contract.on("TotalUpdate", (newTotalPot: bigint, participantCount: bigint, addresses: string[], bets: bigint[]) => {
    try {
      const totalUpdate = {
        totalPot: Number(formatEther(newTotalPot)),
        participantCount: Number(participantCount),
      }
      const updatedParticipants = addresses.map((address, index) => ({
        address,
        bet: Number(formatEther(bets[index])),
      }))
      updatedParticipants.sort((a, b) => b.bet - a.bet)
      updateGameState(totalUpdate.totalPot, totalUpdate.participantCount, updatedParticipants)
      eventEmitter.emit("gameUpdate", { type: "totalUpdate", totalUpdate, updatedParticipants })
    } catch (error) {
      console.error("Error parsing TotalUpdate event:", error)
    }
  })

  contract.on("GameStarted", (endsAt: bigint) => {
    try {
      console.log(`GameStarted event received. Game ends at: ${endsAt.toString()}`)
      eventEmitter.emit("startGameTimer", Number(endsAt))
    } catch (error) {
      console.error("Error handling GameStarted event:", error)
    }
  })

  contract.on("GameResult", (newWinner: string, totalPot: bigint) => {
    try {
      console.log(`"GameResult event received. The game winner: ${newWinner}, winning ${Number(formatEther(totalPot))} ETH`)
      const gameResult = {
        winner: newWinner,
        winningPot: Number(formatEther(totalPot)),
      }
      eventEmitter.emit("gameUpdate", { type: "gameResult", gameResult })
    } catch (error) {
      console.error("Error handling GameResult event:", error)
    }
  })

  contract.on("GameFinished", (startAt: bigint) => {
    try {
      console.log(`GameFinished event received. New game will start at: ${startAt.toString()}`)
      eventEmitter.emit("startNewSessionTimer", Number(startAt))
    } catch (error) {
      console.error("Error handling GameFinished event:", error)
    }
  })

  eventEmitter.on("startGameTimer", (endsAt: number) => {
    startGameTimer(endsAt)
  })

  eventEmitter.on("startNewSessionTimer", (startAt: number) => {
    console.log("Starting new game timer")
    startNewSessionTimer(startAt)
    eventEmitter.emit("gameUpdate", { type: "newSessionTimerStarted" })
  })

  eventEmitter.on("gameEnded", async () => {
    console.log("Winner selecting")
    await selectWinner()
  })

  eventEmitter.on("createNewGameSession", async () => {
    console.log("Starting a new game session")
    updateGameState(0, 0, [])
    await createNewGameSession()
  })
}
