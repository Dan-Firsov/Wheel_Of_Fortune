import { getContract } from "../config/contract"
import { createNewGameSession, selectWinner } from "../controllers/gameController"
import { startGameTimer, startNewSessionTimer } from "../controllers/timerController"
import { eventEmitter } from "../events/gameEvents"
import { formatEther } from "ethers"

export function initializeEventSubscriptions() {
  const contract = getContract()

  if (!contract) {
    throw new Error("Contract is not initialized before subscribing to events.")
  }

  contract.on("TotalUpdate", (newTotalPot: bigint, participantCount: bigint) => {
    const totalUpdate = {
      totalPot: Number(formatEther(newTotalPot)),
      participantCount: Number(participantCount),
    }
    eventEmitter.emit("gameUpdate", { type: "totalUpdate", totalUpdate })
  })
  contract.on("ParticipantsUpdated", (addresses: string[], bets: bigint[]) => {
    const updatedParticipants = addresses.map((address, index) => ({
      address,
      bet: Number(formatEther(bets[index])),
    }))
    updatedParticipants.sort((a, b) => b.bet - a.bet)

    eventEmitter.emit("gameUpdate", { type: "participantsUpdated", updatedParticipants })
  })

  contract.on("GameResult", (newWinner: string, totalPot: bigint) => {
    console.log(`"GameResult event received. The game winner: ${newWinner}, winning ${Number(formatEther(totalPot))} ETH`)
    const gameResult = {
      winner: newWinner,
      winningPot: Number(formatEther(totalPot)),
    }
    eventEmitter.emit("gameUpdate", { type: "gameResult", gameResult })
  })

  contract.on("GameFinished", (startAt: bigint) => {
    console.log(`GameFinished event received. New game will start at: ${startAt.toString()}`)
    eventEmitter.emit("startNewSessionTimer", Number(startAt))
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
    await createNewGameSession()
  })
}
