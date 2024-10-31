import { formatEther } from "ethers"
import contract from "../config/contract"
import { eventEmitter } from "../events/gameEvents"

export async function selectWinner() {
  try {
    const tx = await contract.spinWheel()
    await tx.wait()
    console.log(`The winner has been chosen! txHash: ${tx.hash} `)
  } catch (error) {
    console.error("Winner selection error:", error)
  }
}
export async function createNewGameSession() {
  try {
    const tx = await contract.createGameSession()
    await tx.wait()
    console.log(`The new game session has been chosen! txHash: ${tx.hash} `)
  } catch (error) {
    console.error("Winner selection error:", error)
  }
}

contract.on("GameStarted", (endsAt: bigint) => {
  console.log(`GameStarted event received. The game will end at: ${endsAt.toString()}`)
  eventEmitter.emit("startGameTimer", Number(endsAt))
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

eventEmitter.on("gameEnded", async () => {
  console.log("Winner selecting")
  await selectWinner()
})

eventEmitter.on("createNewGameSession", async () => {
  console.log("Starting a new game session")
  await createNewGameSession()
})
