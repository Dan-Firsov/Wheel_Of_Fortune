import { useState } from "react"
import DepositButton from "./button/depositButton"
import DepositInput from "./input/depositInput"
import { Deposit } from "../../../utils/wheelOfForune/wofDeposit"

export default function DepositPanel() {
  const [value, setValue] = useState<string>("")

  const handleTransfer = async () => {
    if (value) {
      await Deposit(value)
    } else {
      console.log("Please provide value.")
    }
  }

  return (
    <div className="deposit-panel-wrapper">
      <DepositInput value={value} onValueChange={(e) => setValue(e.target.value)}></DepositInput>
      <DepositButton onClick={handleTransfer}>Deposit</DepositButton>
    </div>
  )
}
