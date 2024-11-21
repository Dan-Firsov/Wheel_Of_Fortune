import { useEffect } from "react"
import { useWheelOfFortuneStore } from "../../../store/WheelOfFortuneStore"
import { socket } from "../../../store/ConnectionStore"
import "./participantBetsPanel.css"

export default function ParticipantBetsPanel() {
  const { totalPot, participants, setParticipants } = useWheelOfFortuneStore()

  useEffect(() => {
    fetch("http://localhost:5000/api/game-state")
      .then((res) => res.json())
      .then((gameState) => {
        setParticipants(gameState.participants)
      })
      .catch((error) => console.error("Error fetching game state:", error))

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
    <div className="participant-table">
      {participants.length === 0 ? (
        <table>
          <tbody>
            <tr>
              <td colSpan={4} className="waiting-cell">
                Waiting for participants...
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Participants</th>
              <th>Address</th>
              <th>Bet</th>
              <th>Chance</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => {
              const winChance = (participant.bet / totalPot) * 100

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{participant.address?.slice(0, 7) + "...." + participant.address?.slice(-6)}</td>
                  <td>{participant.bet}</td>
                  <td>{winChance.toFixed(2)}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
