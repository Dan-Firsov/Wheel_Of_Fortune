import { useEffect } from "react"
import "./wofHeader.css"
import { useWheelOfFortuneStore } from "../../../store/WheelOfFortuneStore"
import { socket } from "../../../store/ConnectionStore"

export default function WofHeader() {
  const { totalPot, totalParticipants, setTotalPot, setTotalParticipants } = useWheelOfFortuneStore()

  useEffect(() => {
    fetch("https://project-v1-0-9.onrender.com/api/game-state")
      .then((res) => res.json())
      .then((gameState) => {
        setTotalPot(gameState.totalPot)
        setTotalParticipants(gameState.participantCount)
      })
      .catch((error) => console.error("Error fetching game state:", error))

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
    <div className="wof-header-wrapper">
      {totalPot && totalParticipants ? (
        <>
          <div className="total-wrapper">
            <span style={{ fontWeight: "bold" }}>Total pot:</span>
            <span>{`${totalPot} ETH`}</span>
          </div>
          <div className="total-wrapper">
            <span style={{ fontWeight: "bold" }}>Total participants:</span>
            <span>{totalParticipants}</span>
          </div>
        </>
      ) : null}
    </div>
  )
}
