import "./totalParcticipants.css"
import { useEffect } from "react"
import { TotalPot } from "../../../utils/wheelOfForune/wofTotalPot"
import { useParcticipantsState } from "../../../store/WheelOfFortuneStore"

export default function TotalParcticipantsPanel() {
  const { totalParcticipants, setTotalParcticipants } = useParcticipantsState()

  useEffect(() => {
    const getTotalParcticipants = async () => {
      try {
        const currentTotal = await TotalPot()
        setTotalParcticipants(currentTotal.toString())
      } catch (error: any) {
        if (error.reason && error.reason.includes("No active game sessions")) {
          console.log("No active game sessions")
        }
      }
    }

    getTotalParcticipants()
  }, [setTotalParcticipants])

  return (
    <div className="total-pot-wrapper">
      <span style={{ fontWeight: "bold" }}>Total parcticipants:</span>
      <span>{totalParcticipants ? totalParcticipants : "Loading..."}</span>
    </div>
  )
}
