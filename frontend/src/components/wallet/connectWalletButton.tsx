import { useEffect, useRef, useState } from "react"
import styles from "./connectWalletButton.module.css"
import { useWallet, useContractStore } from "../../store/ConnectionStore"
import { connectWallet } from "../../utils/WalletConnection"
import { GetBalance } from "../../utils/wheelOfForune/getBalance"
import UserCard from "../header/userCard/UserCard"

let isRequestingAccounts = false

export default function ConnectWalletButton() {
  const { address, setAddress, setBalance } = useWallet()
  const [isUserCardVisible, setIsUserCardVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { browsContract } = useContractStore()

  const buttonRef = useRef<HTMLButtonElement>(null)
  const userCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      if (window.ethereum) {
        try {
          const accounts: string[] = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            await connectWallet()
          } else {
            setAddress(null)
            setBalance(null)
          }
        } catch (error) {
          console.error("Error connecting to MetaMask:", error)
        } finally {
          isRequestingAccounts = false
        }
      } else {
        setAddress(null)
      }
    }
    fetchBalance()
  }, [])

  useEffect(() => {
    const handleCurrentBalance = async () => {
      await GetBalance()
    }
    if (browsContract) {
      browsContract.on("Deposit", handleCurrentBalance)
      browsContract.on("Withdraw", handleCurrentBalance)
      browsContract.on("BetPlaced", handleCurrentBalance)
      browsContract.on("WithdrawBet", handleCurrentBalance)
      browsContract.on("GameResult", handleCurrentBalance)
    }
    return () => {
      if (browsContract) {
        browsContract.off("Deposit", handleCurrentBalance)
        browsContract.off("Withdraw", handleCurrentBalance)
        browsContract.off("BetPlaced", handleCurrentBalance)
        browsContract.off("WithdrawBet", handleCurrentBalance)
        browsContract.off("GameResult", handleCurrentBalance)
      }
    }
  }, [browsContract])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userCardRef.current && !userCardRef.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsAnimating(false)
        setTimeout(() => setIsUserCardVisible(false), 350)
      }
    }

    const handleWindowBlur = () => {
      setIsAnimating(false)
      setTimeout(() => setIsUserCardVisible(false), 350)
    }
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("blur", handleWindowBlur)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const connectMetaMask = async () => {
    if (!isRequestingAccounts) {
      try {
        isRequestingAccounts = true
        await connectWallet()
      } catch (error) {
        console.error("Error connecting to MetaMask:", error)
      } finally {
        isRequestingAccounts = false
      }
    } else {
      console.log("MetaMask is already processing a request. Please wait.")
    }
  }

  const handleToggleUserCard = () => {
    if (address) {
      if (!isUserCardVisible) {
        setIsUserCardVisible(true)
        setTimeout(() => setIsAnimating(true), 0)
      } else {
        setIsAnimating(false)
        setTimeout(() => setIsUserCardVisible(false), 350)
      }
    } else {
      connectMetaMask()
    }
  }

  return (
    <div className={styles.connectWalletWraper}>
      <button ref={buttonRef} className={`${styles.connectButton} ${isAnimating ? styles.active : ""}`} onClick={handleToggleUserCard}>
        <span>{address ? `${address?.slice(0, 5) + "..." + address?.slice(-4)}` : <span style={{ fontWeight: "bold" }}>Connect Wallet</span>}</span>
      </button>
      {isUserCardVisible && <UserCard userCardRef={userCardRef} isAnimating={isAnimating} />}
    </div>
  )
}
