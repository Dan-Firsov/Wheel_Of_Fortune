import { useEffect, useState } from "react"
import "./wofConnectWalletButton.css"
import { useAddress, useContractStore } from "../../../store/WalletStore"
import { wofConnectWallet } from "../../../utils/wofWalletConnection"
import WalletButton from "../button/WalletButton"
import { useBrowsContract } from "../../../hooks/useBrowsContract"

export default function WofConnectWalletButton() {
  const { address, setAddress } = useAddress()
  const [balance, setBalance] = useState<string | null>(null)
  const { browsContract, setBrowsContract, setSigContract } = useContractStore()

  useEffect(() => {
    setBrowsContract()
    setSigContract()
    const fetchBalance = async () => {
      if (window.ethereum) {
        const accounts: string[] = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          const currentBalance = await wofConnectWallet()
          if (currentBalance) {
            setBalance(currentBalance)
          }
        } else {
          setAddress(null)
        }
      } else {
        setAddress(null)
      }
    }
    fetchBalance()
  }, [])

  useEffect(() => {
    const handleCurrentBalance = async () => {
      const currentBalance = await wofConnectWallet()
      if (currentBalance) {
        setBalance(currentBalance)
      }
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
    wofConnectWallet()
  }

  return (
    <div className="connect-wallet-button-wraper">
      <WalletButton onClick={() => connectMetaMask()}>{address ? `${address?.slice(0, 5) + "..." + address?.slice(-4)}` : "Connect Wallet"}</WalletButton>
      {balance && (
        <div className="balance-wrapper">
          <span>{`Balance: ${balance.slice(0, 8)} ETH`}</span>
        </div>
      )}
    </div>
  )
}
