import { useState } from "react"
import DepositButton from "./button/depositButton"
import DepositInput from "./input/depositInput"
import { Deposit } from "../../../utils/wheelOfForune/wofDeposit"

export default function DepositPanel() {
  const [value, setValue] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleDeposit = async () => {
    if (value) {
      await Deposit(value)
      setErrorMessage("")
    } else {
      console.log("Please provide value.")
      setErrorMessage("Please provide value.")
    }
  }

  return (
    <div className="deposit-panel-wrapper">
      <DepositInput value={value} onValueChange={(e) => setValue(e.target.value)}></DepositInput>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <DepositButton onClick={handleDeposit}>Deposit</DepositButton>
    </div>
  )
}
