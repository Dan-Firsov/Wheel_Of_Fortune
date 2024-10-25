import { useEffect, useState } from "react"
import "./wofConnectWalletButton.css"
import { useAddress, wofAddress } from "../../../store/WalletStore"
import { wofConnectWallet } from "../../../utils/wofWalletConnection"
import WalletButton from "../button/WalletButton"
import { ethers } from "ethers"
import { WheelOfFortuneABI } from "../../../assests/WheelOfFortuneABI"

export default function WofConnectWalletButton() {
  const { address, setAddress } = useAddress()

  const [balance, setBalance] = useState<string | null>(null)

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(wofAddress, WheelOfFortuneABI, provider)

    ;(async () => {
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
    })()

    const handleCurrentBalance = async () => {
      const currentBalance = await wofConnectWallet()

      if (currentBalance) {
        setBalance(currentBalance)
      }
    }

    contract.on("Deposit", handleCurrentBalance)
    contract.on("Withdraw", handleCurrentBalance)
    contract.on("BetPlaced", handleCurrentBalance)

    return () => {
      contract.off("Deposit", handleCurrentBalance)
    }
  }, [])

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
