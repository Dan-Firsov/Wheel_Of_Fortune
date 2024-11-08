import { useState } from "react"
import { Deposit } from "../../../utils/wheelOfForune/deposit"
import Input from "../../input/input"
import Button from "../../button/Button"

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
      <Input value={value} onValueChange={(e) => setValue(e.target.value.replace(",", "."))}></Input>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <Button onClick={handleDeposit}>Deposit</Button>
    </div>
  )
}
