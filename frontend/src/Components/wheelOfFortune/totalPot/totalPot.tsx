import { useEffect } from "react"
import { TotalPot } from "../../../utils/wheelOfForune/wofTotalPot"
import { usePotState } from "../../../store/WheelOfFortuneStore"
import "./totalPot.css"

export default function TotalPotPanel() {
  const { totalPot, setTotalPot } = usePotState()

  useEffect(() => {
    const getTotalPot = async () => {
      try {
        const currentTotal = await TotalPot()
        setTotalPot(currentTotal.toString())
      } catch (error: any) {
        if (error.reason && error.reason.includes("No active game sessions")) {
          console.log("No active game sessions")
        }
      }
    }

    getTotalPot()
  }, [setTotalPot])

  return (
    <div className="total-pot-wrapper">
      <span style={{ fontWeight: "bold" }}>Total pot:</span>
      <span>{totalPot ? totalPot : "Loading..."}</span>
    </div>
  )
}
