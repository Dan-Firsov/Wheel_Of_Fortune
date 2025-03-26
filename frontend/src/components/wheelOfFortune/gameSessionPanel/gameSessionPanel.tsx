import styles from "./gameSessionPanel.module.css"
import { useWheelOfFortuneStore } from "../../../store/WheelOfFortuneStore"
import {GamePhase, useGameSessionPanel } from "./useGameSessionPanel"

export default function GameSessionPanel() {
  const {gamePhase, timeLeft, newGameTimeLeft, winner, winnerPrize,} = useGameSessionPanel()
  const { totalParticipants } = useWheelOfFortuneStore()

  return (
    <div className={styles.gameSessionPanelWrapper}>
      {gamePhase === GamePhase.WAITING && (
        <div>
          <h2>{`Waiting for participants... (${3 - totalParticipants} left)`}</h2>
        </div>
      )}

      {gamePhase === GamePhase.ONGOING && timeLeft !== null && (
        <div>
          <h2>Ends game time: {timeLeft} sec</h2>
          {timeLeft && <progress className={`${styles.progressbarGameSession} animated"`} id="p1" value={timeLeft} max="60"></progress>}
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
