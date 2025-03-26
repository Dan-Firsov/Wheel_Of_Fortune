import { useWheelOfFortuneStore } from "../../store/WheelOfFortuneStore"
import { fetchGameState } from "../api/gameState"

   export const updateGameState = async () => {
      const { setTotalPot, setTotalParticipants,setParticipants } = useWheelOfFortuneStore.getState()
      try {
        const data = await fetchGameState()
        setTotalPot(data.totalPot)
        setTotalParticipants(data.participantCount)
        setParticipants(data.participants)
      } catch (error) {
        console.error("Error updating game state:", error)
      }
    }
