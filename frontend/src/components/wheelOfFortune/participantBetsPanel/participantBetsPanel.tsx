import { useEffect } from "react"
import { useWheelOfFortuneStore } from "../../../store/WheelOfFortuneStore"
import { socket } from "../../../store/ConnectionStore"
import styles from "./participantBetsPanel.module.css"
export default function ParticipantBetsPanel() {
  const { totalPot, participants, setParticipants } = useWheelOfFortuneStore()

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const data = await fetch("https://project-v1-0-9.onrender.com/api/game-state")
        const {
          gameState: { participants },
        } = await data.json()
        setParticipants(participants)
      } catch (error) {
        console.error("Error fetching game state:", error)
      }
    }
    fetchGameState()

    socket.on("gameUpdate", (update) => {
      if (update.type === "totalUpdate") {
        setParticipants(update.updatedParticipants)
      }
    })
    return () => {
      socket.off("gameUpdate")
    }
  }, [])

  return (
    <div className={styles.participantsWrapper}>
      {participants.length === 0 ? (
        <table className={styles.participantsTable}>
          <tbody className={styles.participantsTbody}>
            <tr>
              <td colSpan={4} className={`${styles.participantsTd} ${styles.waitingCell}`}>
                Waiting for participants...
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table className={styles.participantsTable}>
          <thead className={styles.participantsThead}>
            <tr>
              <th className={styles.participantsTh}>Participants</th>
              <th className={styles.participantsTh}>Address</th>
              <th className={styles.participantsTh}>Bet</th>
              <th className={styles.participantsTh}>Chance</th>
            </tr>
          </thead>
          <tbody className={styles.participantsTbody}>
            {participants.map((participant, index) => {
              const winChance = (participant.bet / totalPot) * 100

              return (
                <tr key={index}>
                  <td className={styles.participantsTd}>{index + 1}</td>
                  <td className={styles.participantsTd}>{participant.address?.slice(0, 7) + "...." + participant.address?.slice(-6)}</td>
                  <td className={styles.participantsTd}>{participant.bet}</td>
                  <td className={styles.participantsTd}>{winChance.toFixed(2)}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
