import { getProvider } from "../config/contract"
import { eventEmitter } from "../events/gameEvents"

async function getBlockTimestamp(): Promise<number> {
  const provider = getProvider()
  if (!provider) {
    throw new Error("Contract is not initialized")
  }
  const block = await provider.getBlock("latest")
  if (!block) {
    throw new Error("Failed to retrieve block timestamp.")
  }
  return block.timestamp
}

export async function startGameTimer(endsAt: number) {
  const blockTimestamp = await getBlockTimestamp()
  let timeLeft = endsAt - blockTimestamp
  const interval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(interval)
      eventEmitter.emit("gameUpdate", { type: "gameEnded" })
      eventEmitter.emit("gameEnded")
    } else {
      eventEmitter.emit("gameUpdate", { type: "timerUpdate", timeLeft })
      timeLeft--
    }
  }, 1000)
}

export async function startNewSessionTimer(startAt: number) {
  const blockTimestamp = await getBlockTimestamp()
  let timeLeft = startAt - blockTimestamp
  const interval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(interval)
      eventEmitter.emit("createNewGameSession")
      eventEmitter.emit("gameUpdate", { type: "newSessionStarted" })
    } else {
      eventEmitter.emit("gameUpdate", { type: "newSessionTimerUpdate", timeLeft })
      timeLeft--
    }
  }, 1000)
}
