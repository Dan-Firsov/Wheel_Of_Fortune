import { useState } from "react"
import { Transfer } from "../../../utils/Transfer"
import TransferButton from "./button/transferButton"
import TransferInput from "./input/transferInput"
import TransactionHistoryPanel from "./transactionHistory/transactionHistoryPanel"

export default function TransferTokenPanel() {
  const [address, setAddress] = useState<string>("")
  const [value, setValue] = useState<string>("")

  const handleTransfer = async () => {
    console.log(address, value)
    if (address && value) {
      await Transfer(address, value)
    } else {
      console.log("Please provide both address and value.")
    }
  }

  return (
    <div className="transfer-token-panel-wrapper">
      <TransferInput recipient={address} value={value} onRecipientChange={(e) => setAddress(e.target.value)} onValueChange={(e) => setValue(e.target.value)}></TransferInput>
      <TransferButton onClick={handleTransfer}>Transfer</TransferButton>
      <TransactionHistoryPanel></TransactionHistoryPanel>
    </div>
  )
}
