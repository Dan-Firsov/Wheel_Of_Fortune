import { useEffect } from "react"
import styles from "./wofHeader.module.css"
import { useWheelOfFortuneStore } from "../../../store/WheelOfFortuneStore"
import { socket } from "../../../store/ConnectionStore"

export default function WofHeader() {
  const { totalPot, totalParticipants, setTotalPot, setTotalParticipants } = useWheelOfFortuneStore()

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch("https://project-v1-0-9.onrender.com/api/game-state")
        const gameState = await response.json()
        setTotalPot(gameState.totalPot)
        setTotalParticipants(gameState.participantCount)
      } catch (error) {
        console.error("Error fetching game state:", error)
      }
    }

    fetchGameState()

    socket.on("gameUpdate", (update) => {
      if (update.type === "totalUpdate") {
        setTotalPot(update.totalUpdate.totalPot)
        setTotalParticipants(update.totalUpdate.participantCount)
      }
    })
    return () => {
      socket.off("gameUpdate")
    }
  }, [])

  return (
    <div className={styles.wofHeaderWrapper}>
      {totalPot && totalParticipants ? (
        <>
          <div className={styles.totalWrapper}>
            <span style={{ fontWeight: "bold" }}>Total pot:</span>
            <span>{`${totalPot} ETH`}</span>
          </div>
          <div className={styles.totalWrapper}>
            <span style={{ fontWeight: "bold" }}>Total participants:</span>
            <span>{totalParticipants}</span>
          </div>
        </>
      ) : null}
    </div>
  )
}
