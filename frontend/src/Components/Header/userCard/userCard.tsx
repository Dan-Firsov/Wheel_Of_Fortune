import { useState } from "react"
import styles from "./userCard.module.css"
import Button from "../../button/Button"
import Input from "../../input/input"
import { Withdraw } from "../../../utils/wheelOfForune/withdraw"
import { Deposit } from "../../../utils/wheelOfForune/deposit"
import { useWallet } from "../../../store/ConnectionStore"

interface UserCardProps {
  isVisible: boolean
}

export default function UserCard({ isVisible }: UserCardProps) {
  const [depositAmount, setDepositAmount] = useState<string | "">("")
  const [withdrawAmount, setWithdrawAmount] = useState<string | "">("")
  const [errorMessageDep, setErrorMessageDep] = useState("")
  const [errorMessageWith, setErrorMessageWith] = useState("")
  const [errorVisibleDep, setErrorvisibleDep] = useState(false)
  const [errorVisibleWith, setErrorvisibleWith] = useState(false)
  const { address, balance } = useWallet()

  const handleDeposit = async () => {
    if (depositAmount) {
      await Deposit(depositAmount)
      setErrorMessageDep("")
    } else {
      console.log("Please provide value.")
      setErrorMessageDep("Please provide value.")
      setErrorvisibleDep(true)
      setTimeout(() => {
        setErrorvisibleDep(false)
      }, 3000)
    }
  }

  const handleWithdraw = async () => {
    try {
      if (withdrawAmount) {
        await Withdraw(withdrawAmount)
        setErrorMessageWith("")
        setErrorvisibleWith(false)
      } else {
        console.log("Please provide value.")
        setErrorMessageWith("Please provide value.")
        setErrorvisibleWith(true)
        setTimeout(() => {
          setErrorvisibleWith(false)
        }, 3000)
      }
    } catch (error: any) {
      if (error.reason && error.reason.includes("Insufficient funds on balance")) {
        setErrorMessageWith("Insufficient funds on balance")
        setErrorvisibleWith(true)
        setTimeout(() => {
          setErrorvisibleWith(false)
        }, 3000)
      } else {
        setErrorMessageWith("Error during withdrawal")
        setErrorvisibleWith(true)
        setTimeout(() => {
          setErrorvisibleWith(false)
        }, 3000)
      }
    }
  }

  return (
    <div className={`${styles.userCard} ${isVisible ? styles.visible : ""}`}>
      <h3>Wallet</h3>
      <p className={styles.address}>{address}</p>
      <p className={styles.balance}>Balance: {balance ? <span>{balance}</span> : <span>0</span>} ETH</p>

      <div className={styles.actions}>
        <div className={styles.actionsItem}>
          <Input value={depositAmount} onValueChange={(e) => setDepositAmount(e.target.value.replace(",", "."))}></Input>
          {errorMessageDep && <p className={`${styles.error} ${errorVisibleDep ? styles.visible : ""}`}>{errorMessageDep}</p>}

          <Button customClass={styles.buttonDeposit} onClick={handleDeposit}>
            Deposit
          </Button>
        </div>

        <div className={styles.actionsItem}>
          <Input value={withdrawAmount} onValueChange={(e) => setWithdrawAmount(e.target.value.replace(",", "."))} />
          {errorMessageWith && <p className={`${styles.error} ${errorVisibleWith ? styles.visible : ""}`}>{errorMessageWith}</p>}
          <Button customClass={styles.buttonWithdraw} onClick={handleWithdraw}>
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  )
}
