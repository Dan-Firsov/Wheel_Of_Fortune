import { useEffect, useRef, useState } from "react"
import styles from "./connectWalletButton.module.css"
import { useWalletInfo } from "../../../store/ConnectionStore"
import Button from "../../../shared/button/Button"
import useBalanceUpdates from "./hooks/useBalanceUpdates"
import { connectWallet } from "../../../utils/WalletConnection"
import UserCard from "./userCard/UserCard"
import { useWalletState } from "./hooks/useWalletState"

export default function WalletButton() {
  const { address } = useWalletInfo()
  const [isUserCardVisible, setIsUserCardVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isRequestingAccounts, setIsRequestingAccounts] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const userCardRef = useRef<HTMLDivElement>(null)
 
  useWalletState()
  useBalanceUpdates()

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
        setIsRequestingAccounts(true)
        await connectWallet()
      } catch (error) {
        console.error("Error connecting to wallet:", error)
      } finally {
        setIsRequestingAccounts(false)
      }
    } else {
      console.log("Wallet is already processing a request. Please wait.")
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
      <Button ref={buttonRef} customClass={`${styles.connectButton} ${isAnimating ? styles.active : ""}`} onClick={handleToggleUserCard}>
        <span>{address ? `${address?.slice(0, 5) + "..." + address?.slice(-4)}` : <span style={{ fontWeight: "bold" }}>Connect Wallet</span>}</span>
      </Button>
      {isUserCardVisible && <UserCard userCardRef={userCardRef} isAnimating={isAnimating} />}
    </div>
  )
}
