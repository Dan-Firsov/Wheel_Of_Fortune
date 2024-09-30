import { ethers, BrowserProvider, formatEther } from "ethers"
import Button from "./button/WalletButton"
import { useEffect, useState } from "react"
import "./ConnectWalletButton.css"
import { tokenAddress, useConnect } from "../../store/store"
import { connectWallet } from "../../utils/connectWallet"
import { setBalances } from "../../utils/setBalance"

export default function ConnectWalletButton() {
  const { provider, signer, address } = useConnect()

  const [balance, setBalance] = useState<string | null>(null)
  const [balanceToken, setBalanceToken] = useState<string>("0")

  useEffect(() => {
    console.log("Test")
  }, [])

  const connectMetaMask = async () => {
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults")
    } else {
      await connectWallet()
      console.log(address, signer, provider)

      if (address && signer && provider !== null) {
        const currentBalances = await setBalances(address, signer, provider)
        if (currentBalances) {
          setBalanceToken(currentBalances.userTokenBalance)
          setBalance(currentBalances.balance)
        }
      }
    }
  }

  return (
    <div className="connect-wallet-button-wraper">
      <Button onClick={() => connectMetaMask()}>{signer ? `${address?.slice(0, 4) + "..." + address?.slice(-5)}` : "Connect Wallet"}</Button>
      {balance && (
        <div className="balance-wrapper">
          <span>{`Balance: ${balance.slice(0, 8)} ETH`}</span>
          <span>{`${balanceToken} WLD`}</span>
        </div>
      )}
    </div>
  )
}
