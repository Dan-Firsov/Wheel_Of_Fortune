import { useEffect, useState } from "react"
import WithdrawButton from "./button/withdrawButton"
import WithdrawInput from "./input/withdrawInput"
import { Withdraw } from "../../../utils/wheelOfForune/wofWithdraw"
import { ethers } from "ethers"
import { wofAddress } from "../../../store/WalletStore"

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
      <WithdrawInput value={value} onValueChange={(e) => setValue(e.target.value)}></WithdrawInput>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <WithdrawButton onClick={handleWithdraw}>Withdraw</WithdrawButton>
    </div>
  )
}
