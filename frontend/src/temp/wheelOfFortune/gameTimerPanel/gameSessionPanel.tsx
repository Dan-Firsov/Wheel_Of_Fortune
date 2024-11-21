import { useEffect, useState } from "react"
import { socket } from "../../../store/ConnectionStore"
import "./gameSessionPanel.css"
import { useWheelOfFortuneStore } from "../../../store/WheelOfFortuneStore"

export default function GameSessionPanel() {
  const [gamePhase, setGamePhase] = useState<"waiting" | "ongoing" | "determining" | "nextGameTimer">("waiting")
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [newGameTimeLeft, setNewGameTimeLeft] = useState<number | null>(null)
  const [winner, setWinner] = useState<string | null>(null)
  const [winnerPrize, setWinnerPrize] = useState<number | null>(null)
  const { totalParticipants } = useWheelOfFortuneStore()

  useEffect(() => {
    socket.on("gameUpdate", (update) => {
      console.log("Received update:", update)
      switch (update.type) {
        case "timerUpdate":
          console.log(update.timeLeft)
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
    <div className="game-session-panel-wrapper">
      {gamePhase === "waiting" && (
        <div>
          <h2>{`Waiting for participants... (${3 - totalParticipants} left)`}</h2>
        </div>
      )}

      {gamePhase === "ongoing" && timeLeft !== null && (
        <div>
          <h2>Ends game time: {timeLeft} sec</h2>
          {timeLeft && <progress className="progressbar-game-session animated" id="p1" value={timeLeft} max="60"></progress>}
        </div>
      )}

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
