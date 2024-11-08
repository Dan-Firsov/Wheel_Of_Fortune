import { useState } from "react"
import { Withdraw } from "../../../utils/wheelOfForune/withdraw"
import Input from "../../input/input"
import Button from "../../button/Button"

export default function WithdrawPanel() {
  const [value, setValue] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleWithdraw = async () => {
    try {
      if (value) {
        await Withdraw(value)
        setErrorMessage("")
      } else {
        console.log("Please provide value.")
        setErrorMessage("Please provide value.")
      }
    } catch (error: any) {
      if (error.reason && error.reason.includes("Insufficient funds on balance")) {
        setErrorMessage("Insufficient funds on balance")
      } else {
        setErrorMessage("Error during withdrawal")
      }
    }
  }

  return (
    <div className="deposit-panel-wrapper">
      <Input value={value} onValueChange={(e) => setValue(e.target.value)}></Input>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <Button onClick={handleWithdraw}>Withdraw</Button>
    </div>
  )
}
