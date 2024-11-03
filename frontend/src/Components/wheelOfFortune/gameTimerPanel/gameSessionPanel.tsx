import { useEffect, useState } from "react"
import io from "socket.io-client"

const socket = io("http://localhost:5000")

export default function GameSessionPanel() {
  const [gamePhase, setGamePhase] = useState<"waiting" | "ongoing" | "determining" | "nextGameTimer">("waiting")
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [newGameTimeLeft, setNewGameTimeLeft] = useState<number | null>(null)
  const [winner, setWinner] = useState<string | null>(null)
  const [winnerPrize, setWinnerPrize] = useState<number | null>(null)

  useEffect(() => {
    socket.on("gameUpdate", (update) => {
      switch (update.type) {
        case "timerUpdate":
          setTimeLeft(update.timeLeft)
          setGamePhase("ongoing")
          break
        case "gameEnded":
          setGamePhase("determining")
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

      {gamePhase === "ongoing" && timeLeft !== null && <h2>Ends game time: {timeLeft} sec</h2>}

      {gamePhase === "determining" && <h2>Determining the winner...</h2>}

      {gamePhase === "nextGameTimer" && newGameTimeLeft !== null && <h2>Next game starts in: {newGameTimeLeft} sec</h2>}

      {winner && (
        <h3>
          Winner: {winner?.slice(0, 7) + "...." + winner?.slice(-6)} Winning prize: {winnerPrize} ETH
        </h3>
      )}
    </div>
  )
}
