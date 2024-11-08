import { useState } from "react"
import { PlaceBet } from "../../../utils/wheelOfForune/placeBet"
import "./betPanel.css"
import Button from "../../button/Button"
import Input from "../../input/input"

export default function BetPanel() {
  const [value, setValue] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleBet = async () => {
    try {
      if (value) {
        await PlaceBet(value)
        setErrorMessage("")
      } else {
        console.log("Please provide value.")
        setErrorMessage("Please provide value.")
      }
    } catch (error: any) {
      if (error.reason && error.reason.includes("Insufficient funds on balance")) {
        setErrorMessage("Insufficient funds on balance")
      }

      if (error.reason && error.reason.includes("No active game sessions")) {
        setErrorMessage("No active game sessions")
      }

      if (error.reason && error.reason.includes("Session already completed")) {
        setErrorMessage("Session already completed")
      }
    }
  }
  return (
    <div className="bet-panel-wrapper">
      <Input value={value} onValueChange={(e) => setValue(e.target.value)}></Input>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <Button onClick={handleBet}>Bet</Button>
    </div>
  )
}
