import { useEffect } from "react"
import { useWheelOfFortuneStore } from "../../../store/WheelOfFortuneStore"
import { socket } from "../../../store/ConnectionStore"

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
      if (update.type === "participantsUpdated") {
        setParticipants(update.updatedParticipants)
      }
    })
    return () => {
      socket.off("gameUpdate")
    }
  }, [])
  return (
    <div>
      <h3>Participants:</h3>
      <ol>
        {participants.map((participant, index) => {
          const winChance = (participant.bet / totalPot) * 100

          return (
            <li key={index}>
              Address: {participant.address?.slice(0, 7) + "...." + participant.address?.slice(-6)}, Bet: {participant.bet}, Chance: {winChance.toFixed(2)}%
            </li>
          )
        })}
      </ol>
    </div>
  )
}
