import { eventEmitter } from "../events/gameEvents"

export function startGameTimer(endsAt: number) {
  const interval = setInterval(() => {
    const timeLeft = endsAt * 1000 - Date.now()
    if (timeLeft <= 0) {
      clearInterval(interval)
      eventEmitter.emit("gameUpdate", { type: "gameEnded" })
      eventEmitter.emit("gameEnded")
    } else {
      eventEmitter.emit("gameUpdate", { type: "timerUpdate", timeLeft })
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

eventEmitter.on("startGameTimer", (endsAt: number) => {
  console.log("Starting game timer")
  startGameTimer(endsAt)
})

eventEmitter.on("startNewSessionTimer", (startAt: number) => {
  console.log("Starting new game timer")
  startNewSessionTimer(startAt)
  eventEmitter.emit("gameUpdate", { type: "newSessionTimerStarted" })
})
