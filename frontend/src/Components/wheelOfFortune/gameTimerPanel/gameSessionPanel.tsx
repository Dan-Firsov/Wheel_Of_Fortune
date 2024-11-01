import { useEffect, useState } from "react"
import io from "socket.io-client"

const socket = io("http://localhost:5000")

export default function GameSessionPanel() {
  const [gamePhase, setGamePhase] = useState<"waiting" | "ongoing" | "nextGameTimer">("waiting")
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [newGameTimeLeft, setNewGameTimeLeft] = useState<number | null>(null)
  const [winner, setWinner] = useState<string | null>(null)
  const [winnerPrize, setWinnerPrize] = useState<number | null>(null)

  useEffect(() => {
    socket.on("gameUpdate", (update) => {
      console.log("Событие пришло", update)
      switch (update.type) {
        case "timerUpdate":
          setTimeLeft(update.timeLeftSec)
          setGamePhase("ongoing")
          break
        case "gameEnded":
          setWinner("Determining the winner...")
          break
        case "gameResult":
          setWinner(update.gameResult.winner)
          setWinnerPrize(update.gameResult.winningPot)
          break
        case "newSessionTimerStarted":
          setNewGameTimeLeft(update.timeLeft || 0)
          setGamePhase("nextGameTimer")
          break
        case "newSessionTimerUpdate":
          setNewGameTimeLeft(update.timeLeft)
          break
        case "newSessionStarted":
          setWinner(null)
          setTimeLeft(null)
          setNewGameTimeLeft(null)
          setGamePhase("waiting")
          break
        default:
          break
      }
    })

    return () => {
      socket.off("gameUpdate")
    }
  }, [])

  return (
    <div>
      {gamePhase === "waiting" && <h2>Waiting for participants...</h2>}

      {gamePhase === "ongoing" && timeLeft !== null && <h2>Ends game time: {Math.floor(timeLeft / 1000)} sec</h2>}

      {gamePhase === "nextGameTimer" && newGameTimeLeft !== null && <h2>Next game starts in: {Math.floor(newGameTimeLeft / 1000)} sec</h2>}

      {winner && (
        <h3>
          Winner: {winner?.slice(0, 7) + "...." + winner?.slice(-6)} Winning prize: {winnerPrize} ETH
        </h3>
      )}
    </div>
  )
}
