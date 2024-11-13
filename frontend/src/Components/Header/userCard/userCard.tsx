import { forwardRef, useEffect, useRef, useState } from "react"
import styles from "./userCard.module.css"
import Button from "../../buttons/Button"
import Input from "../../input/input"
import { Withdraw } from "../../../utils/wheelOfForune/withdraw"
import { Deposit } from "../../../utils/wheelOfForune/deposit"
import { useWallet } from "../../../store/ConnectionStore"
import { DepositButton } from "../../buttons/depositButton"

interface UserCardProps {
  isVisible: boolean
  onClose: () => void
}

const UserCard = forwardRef<HTMLDivElement, UserCardProps>(({ isVisible, onClose }, ref) => {
  const [depositAmount, setDepositAmount] = useState<string | "">("")
  const [withdrawAmount, setWithdrawAmount] = useState<string | "">("")
  const [errorMessageDep, setErrorMessageDep] = useState("")
  const [errorMessageWith, setErrorMessageWith] = useState("")
  const [errorVisibleDep, setErrorvisibleDep] = useState(false)
  const [errorVisibleWith, setErrorvisibleWith] = useState(false)
  const [copyMessageVisible, setCopyMessageVisible] = useState(false)
  const { address, balance } = useWallet()
  const [isAnimating, setIsAnimating] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setIsAnimating(true), 350)
    } else {
      setIsAnimating(false)
    }
  }, [isVisible])
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsAnimating(false)
        setTimeout(() => onClose(), 350)
      }
    }
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isVisible, onClose])

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
    if (depositAmount) {
      await Deposit(depositAmount)
      setErrorMessageDep("")
    } else {
      console.log("Please provide value.")
      setErrorMessageDep("Please provide value.")
      setErrorvisibleDep(true)
      setTimeout(() => {
        setErrorvisibleDep(false)
      }, 2000)
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
    <div className={`${styles.userCard} ${isAnimating ? styles.visible : ""}`} ref={ref as React.RefObject<HTMLDivElement>}>
      <h3 style={{ fontWeight: "bold" }}>Wallet</h3>
      <div className={styles.addressContainer}>
        <p className={styles.address} onClick={handleCopy}>
          {address}
        </p>
        {copyMessageVisible && <span className={styles.copyMessage}>Address copied!</span>}
      </div>
      <p className={styles.balance}>Balance: {balance ? <span>{balance}</span> : <span>0</span>} ETH</p>
      <div className={styles.actions}>
        <div className={styles.actionsItem}>
          <Input value={depositAmount} onValueChange={(e) => setDepositAmount(e.target.value.replace(",", "."))}></Input>
          {errorMessageDep && <p className={`${styles.error} ${errorVisibleDep ? styles.visible : ""}`}>{errorMessageDep}</p>}
          <DepositButton onClick={handleDeposit} />
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
})

export default UserCard
