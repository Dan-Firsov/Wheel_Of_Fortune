import { useState } from "react"
import styles from "./userCard.module.css"
import { Withdraw } from "../../../utils/wheelOfForune/withdraw"
import { Deposit } from "../../../utils/wheelOfForune/deposit"
import { useWallet } from "../../../store/ConnectionStore"
import { DepositButton } from "../../buttons/depositButton/depositButton"
import Button from "../../buttons/button/Button"
import Input from "../../input/Input"

interface IUserCard {
  userCardRef: React.RefObject<HTMLDivElement>
  isAnimating: boolean
}

type Action = "Deposit" | "Withdraw"

const UserCard = ({ userCardRef, isAnimating }: IUserCard) => {
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [errorMessageDep, setErrorMessageDep] = useState("")
  const [errorMessageWith, setErrorMessageWith] = useState("")
  const [errorVisibleDep, setErrorvisibleDep] = useState(false)
  const [errorVisibleWith, setErrorvisibleWith] = useState(false)
  const [copyMessageVisible, setCopyMessageVisible] = useState(false)
  const { address, balance } = useWallet()

  const handleCopy = () => {
    if (address) {
      navigator.clipboard
        .writeText(address)
        .then(() => {
          setCopyMessageVisible(true)
          setTimeout(() => setCopyMessageVisible(false), 3000)
        })
        .catch((err) => console.error("Failed to copy text: ", err))
    }
  }
  const handleDeposit = async () => {
    try {
      if (depositAmount) {
        await Deposit(depositAmount)
        setDepositAmount("")
        setErrorMessageDep("")
      } else {
        console.log("Please provide value.")
        setErrorMessageDep("Please provide value.")
        setErrorvisibleDep(true)
        setTimeout(() => {
          setErrorvisibleDep(false)
        }, 2000)
      }
    } catch (error: any) {
      console.error("Deposit error:", error)
      if (error.reason && error.reason.includes("insufficient funds")) {
        setErrorMessageDep("insufficient funds")
      }
    }
  }

  const handleWithdraw = async () => {
    try {
      if (withdrawAmount) {
        await Withdraw(withdrawAmount)
        setWithdrawAmount("")
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
    <div ref={userCardRef} className={`${styles.userCard} ${isAnimating ? styles.visible : ""}`}>
      <h3>Wallet</h3>
      <div className={styles.addressContainer}>
        <p className={styles.address} onClick={handleCopy}>
          {address}
        </p>
        {copyMessageVisible && <span className={styles.copyMessage}>Address copied!</span>}
      </div>
      <p className={styles.balance}>Balance: {balance ? <span>{balance}</span> : <span>0</span>} ETH</p>
      <div className={styles.actions}>
        <div className={styles.actionsItem}>
          <Input customContainerClass={styles.userCardInput} value={depositAmount} onValueChange={(e) => setDepositAmount(e)}></Input>
          {errorMessageDep && <p className={`${styles.error} ${errorVisibleDep ? styles.visible : ""}`}>{errorMessageDep}</p>}
          <DepositButton onClick={handleDeposit} />
        </div>

        <div className={styles.actionsItem}>
          <Input customContainerClass={styles.userCardInput} value={withdrawAmount} onValueChange={(e) => setWithdrawAmount(e)} />
          {errorMessageWith && <p className={`${styles.error} ${errorVisibleWith ? styles.visible : ""}`}>{errorMessageWith}</p>}
          <Button customClass={styles.buttonWithdraw} onClick={handleWithdraw}>
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserCard
