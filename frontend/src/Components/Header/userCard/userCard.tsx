import { useState } from "react"
import styles from "./userCard.module.css"
import Button from "../../button/Button"
import Input from "../../input/input"
import { Withdraw } from "../../../utils/wheelOfForune/withdraw"
import { Deposit } from "../../../utils/wheelOfForune/deposit"
import { useWallet } from "../../../store/ConnectionStore"

export default function UserCard() {
  const [depositAmount, setDepositAmount] = useState<string | "">("")
  const [withdrawAmount, setWithdrawAmount] = useState<string | "">("")
  const [errorMessageDep, setErrorMessageDep] = useState("")
  const [errorMessageWith, setErrorMessageWith] = useState("")
  const { address, balance } = useWallet()

  const handleDeposit = async () => {
    if (depositAmount) {
      await Deposit(depositAmount)
      setErrorMessageDep("")
    } else {
      console.log("Please provide value.")
      setErrorMessageDep("Please provide value.")
    }
  }

  const handleWithdraw = async () => {
    try {
      if (withdrawAmount) {
        await Withdraw(withdrawAmount)
        setErrorMessageWith("")
      } else {
        console.log("Please provide value.")
        setErrorMessageWith("Please provide value.")
      }
    } catch (error: any) {
      if (error.reason && error.reason.includes("Insufficient funds on balance")) {
        setErrorMessageWith("Insufficient funds on balance")
      } else {
        setErrorMessageWith("Error during withdrawal")
      }
    }
  }

  return (
    <div className={styles.userCard}>
      <h3>Wallet</h3>
      <p className={styles.address}>{address}</p>
      <p className={styles.balance}>Balance: {balance} ETH</p>

      <div className={styles.actions}>
        <div className={styles.deposit}>
          <Input value={depositAmount} onValueChange={(e) => setDepositAmount(e.target.value.replace(",", "."))}></Input>
          {errorMessageDep && <p style={{ color: "red" }}>{errorMessageDep}</p>}
          <Button onClick={handleDeposit}>Deposit</Button>
        </div>

        <div className={styles.withdraw}>
          <Input value={withdrawAmount} onValueChange={(e) => setWithdrawAmount(e.target.value.replace(",", "."))} />
          {errorMessageWith && <p style={{ color: "red" }}>{errorMessageWith}</p>}
          <Button onClick={handleWithdraw}>Withdraw</Button>
        </div>
      </div>
    </div>
  )
}
