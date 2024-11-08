import { useEffect, useState } from "react"
import "./сonnectWalletButton.css"
import { useWallet, useContractStore } from "../../store/ConnectionStore"
import WalletButton from "../button/Button"
import { connectWallet } from "../../utils/WalletConnection"
import { GetBalance } from "../../utils/wheelOfForune/getBalance"
import UserCard from "../header/userCard/userCard"

let isRequestingAccounts = false

export default function ConnectWalletButton() {
  const { address, setAddress, balance, setBalance } = useWallet()
  const [isUserCardVisible, setIsUserCardVisible] = useState(false)
  const { browsContract } = useContractStore()

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
    }
    return () => {
      if (browsContract) {
        browsContract.off("Deposit", handleCurrentBalance)
        browsContract.off("Withdraw", handleCurrentBalance)
        browsContract.off("BetPlaced", handleCurrentBalance)
      }
    }
  }, [browsContract])

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

  const toggleUserCard = async () => {
    if (address) {
      setIsUserCardVisible(!isUserCardVisible)
    } else {
      connectMetaMask()
    }
  }

  return (
    <div className="connect-wallet-button-wrapper">
      <WalletButton onClick={toggleUserCard}>{address ? `${address?.slice(0, 5) + "..." + address?.slice(-4)}` : "Connect Wallet"}</WalletButton>
      {isUserCardVisible && <UserCard />} {/* Отображаем карточку только если isUserCardVisible = true */}
    </div>
  )
}
