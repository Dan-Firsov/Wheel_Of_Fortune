import { useEffect } from "react"
import { useWheelOfFortuneStore } from "../../../store/WheelOfFortuneStore"
import { socket } from "../../../store/ConnectionStore"
import "./participantBetsPanel.css"

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
    <div className="participants-wrapper">
      {participants.length === 0 ? (
        <table className="participants-table">
          <tbody className="participants-tbody">
            <tr>
              <td colSpan={4} className="participants-td waiting-cell">
                Waiting for participants...
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table className="participants-table">
          <thead className="participants-thead">
            <tr>
              <th className="participants-th">Participants</th>
              <th className="participants-th">Address</th>
              <th className="participants-th">Bet</th>
              <th className="participants-th">Chance</th>
            </tr>
          </thead>
          <tbody className="participants-tbody">
            {participants.map((participant, index) => {
              const winChance = (participant.bet / totalPot) * 100

              return (
                <tr key={index}>
                  <td className="participants-td">{index + 1}</td>
                  <td className="participants-td">{participant.address?.slice(0, 7) + "...." + participant.address?.slice(-6)}</td>
                  <td className="participants-td">{participant.bet}</td>
                  <td className="participants-td">{winChance.toFixed(2)}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
