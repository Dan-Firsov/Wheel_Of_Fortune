import { useEffect, useState } from "react"
import "./wofConnectWalletButton.css"
import { useAddress } from "../../../store/WalletStore"
import { wofConnectWallet } from "../../../utils/wofWalletConnection"
import WalletButton from "../button/WalletButton"

export default function WofConnectWalletButton() {
  const { address, setAddress } = useAddress()

  const [balance, setBalance] = useState<string | null>(null)

  useEffect(() => {
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
  }, [address])

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
