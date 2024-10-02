import Button from "./button/WalletButton"
import { useEffect, useState } from "react"
import "./ConnectWalletButton.css"
import { useAddress, useConnection } from "../../store/WalletStore"
import { WalletConnection } from "../../utils/WalletConnection"
import { GetBalances } from "../../utils/GetBalances"

export default function ConnectWalletButton() {
  const { address } = useAddress()
  const { provider, signer } = useConnection()
  const { connectWallet } = WalletConnection()

  const [balance, setBalance] = useState<string | null>(null)
  const [balanceToken, setBalanceToken] = useState<string>("")

  useEffect(() => {
    ;(async () => {
      if (window.ethereum) {
        const accounts: string[] = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          const result = await connectWallet()
          if (result) {
            const { provider, signer, address } = result
            if (address) {
              const currentBalances = await GetBalances(provider, signer, address)
              if (currentBalances) {
                setBalance(currentBalances.balance)
                setBalanceToken(currentBalances.tokenBalance)
              }
            }
          }
        }
      }
    })()
  }, [address])

  const connectMetaMask = async () => {
    connectWallet()
  }

  return (
    <div className="connect-wallet-button-wraper">
      <Button onClick={() => connectMetaMask()}>{address ? `${address?.slice(0, 4) + "..." + address?.slice(-5)}` : "Connect Wallet"}</Button>
      {balance && (
        <div className="balance-wrapper">
          <span>{`Balance: ${balance.slice(0, 8)} ETH`}</span>
          <span>{`${balanceToken} WLD`}</span>
        </div>
      )}
    </div>
  )
}
