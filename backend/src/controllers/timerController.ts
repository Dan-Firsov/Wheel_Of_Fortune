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
  let timeLeftSec = endsAt - blockTimestamp
  const interval = setInterval(() => {
    console.log(`Time left: ${timeLeftSec} seconds`)
    if (timeLeftSec <= 0) {
      clearInterval(interval)
      eventEmitter.emit("gameUpdate", { type: "gameEnded" })
      eventEmitter.emit("gameEnded")
    } else {
      eventEmitter.emit("gameUpdate", { type: "timerUpdate", timeLeftSec })
      timeLeftSec--
    }
  }, 1000)
}

export function startNewSessionTimer(startAt: number) {
  const interval = setInterval(() => {
    const timeLeft = startAt * 1000 - Date.now()
    if (timeLeft <= 0) {
      clearInterval(interval)
      eventEmitter.emit("createNewGameSession")
      eventEmitter.emit("gameUpdate", { type: "newSessionStarted" })
    } else {
      eventEmitter.emit("gameUpdate", { type: "newSessionTimerUpdate", timeLeft })
    }
  }, 1000)
}
