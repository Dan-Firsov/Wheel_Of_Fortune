import { useEffect, useState } from "react"
import { socket } from "../../../store/ConnectionStore"
import "./gameSessionPanel.css"
import { useWheelOfFortuneStore } from "../../../store/WheelOfFortuneStore"

enum GamePhase {
  WAITING = "waiting",
  ONGOING = "ongoing",
  DETERMINING = "determining",
  NEXTGAMETIMER = "nextGameTimer",
}

enum UpdateType {
  TIMERUPDATE = "timerUpdate",
  GAMEENDED = "gameEnded",
  GAMERESULT = "gameResult",
  NEWSESSIONTIMERSTARTED = "newSessionTimerStarted",
  NEWSESSIONTIMERUPDATE = "newSessionTimerUpdate",
  NEWSESSIONSTARTED = "newSessionStarted",
}
export default function GameSessionPanel() {
  const [gamePhase, setGamePhase] = useState(GamePhase.WAITING)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [newGameTimeLeft, setNewGameTimeLeft] = useState<number | null>(null)
  const [winner, setWinner] = useState<string | null>(null)
  const [winnerPrize, setWinnerPrize] = useState<number | null>(null)
  const { totalParticipants } = useWheelOfFortuneStore()

  useEffect(() => {
    socket.on("gameUpdate", (update) => {
      console.log("Received update:", update)
      switch (update.type) {
        case UpdateType.TIMERUPDATE:
          console.log(update.timeLeft)
          setTimeLeft(update.timeLeft)
          setGamePhase(GamePhase.ONGOING)
          break
        case UpdateType.GAMEENDED:
          setGamePhase(GamePhase.DETERMINING)
          break
        case UpdateType.GAMERESULT:
          setWinner(update.gameResult.winner)
          setWinnerPrize(update.gameResult.winningPot)
          break
        case UpdateType.NEWSESSIONTIMERSTARTED:
          setNewGameTimeLeft(update.timeLeft || 0)
          setGamePhase(GamePhase.NEXTGAMETIMER)
          break
        case UpdateType.NEWSESSIONTIMERUPDATE:
          setNewGameTimeLeft(update.timeLeft)
          break
        case UpdateType.NEWSESSIONSTARTED:
          setWinner(null)
          setTimeLeft(null)
          setNewGameTimeLeft(null)
          setGamePhase(GamePhase.WAITING)
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
      {gamePhase === GamePhase.WAITING && (
        <div>
          <h2>{`Waiting for participants... (${3 - totalParticipants} left)`}</h2>
        </div>
      )}

      {gamePhase === GamePhase.ONGOING && timeLeft !== null && (
        <div>
          <h2>Ends game time: {timeLeft} sec</h2>
          {timeLeft && <progress className="progressbar-game-session animated" id="p1" value={timeLeft} max="60"></progress>}
        </div>
      )}

      {gamePhase === GamePhase.DETERMINING && <h2>Determining the winner...</h2>}

      {gamePhase === GamePhase.NEXTGAMETIMER && newGameTimeLeft !== null && <h2>Next game starts in: {newGameTimeLeft} sec</h2>}

      {winner && (
        <h3>
          Winner: {winner?.slice(0, 7) + "...." + winner?.slice(-6)} Winning prize: {winnerPrize} ETH
        </h3>
      )}
    </div>
  )
}
