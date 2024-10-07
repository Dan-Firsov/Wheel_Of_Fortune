import { useEffect, useState } from "react"
import "./ConnectWalletButton.css"
import { useAddress } from "../../store/WalletStore"
import { connectWallet } from "../../utils/WalletConnection"
import WalletButton from "./button/WalletButton"

export default function ConnectWalletButton() {
  const { address, setAddress } = useAddress()

  const [balance, setBalance] = useState<string | null>(null)
  const [balanceToken, setBalanceToken] = useState<string>("")

  useEffect(() => {
    ;(async () => {
      if (window.ethereum) {
        const accounts: string[] = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          const currentBalances = await connectWallet()
          if (currentBalances) {
            setBalance(currentBalances.balance)
            setBalanceToken(currentBalances.tokenBalance)
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
    connectWallet()
  }

  return (
    <div className="connect-wallet-button-wraper">
      <WalletButton onClick={() => connectMetaMask()}>{address ? `${address?.slice(0, 4) + "..." + address?.slice(-5)}` : "Connect Wallet"}</WalletButton>
      {balance && (
        <div className="balance-wrapper">
          <span>{`Balance: ${balance.slice(0, 8)} ETH`}</span>
          <span>{`${balanceToken} WLD`}</span>
        </div>
      )}
    </div>
  )
}
