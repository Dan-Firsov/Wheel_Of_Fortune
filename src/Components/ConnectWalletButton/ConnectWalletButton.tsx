import { ethers, BrowserProvider, formatEther } from "ethers"
import Button from "./Button/WalletButton"
import { useEffect, useState } from "react"
import "./ConnectWalletButton.css"

export default function ConnectWalletButton() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  useEffect(() => {
    if (signer && provider) {
      ;(async () => {
        try {
          const address = await signer.getAddress()

          const balance = formatEther(await provider.getBalance(address))
          setBalance(balance)
        } catch (error) {
          console.error("Balance Error", error)
        }
      })()
    }
  }, [provider, signer])

  const connectMetaMask = async () => {
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults")
      setProvider(null)
    } else {
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)

      const signer = await provider.getSigner()
      setSigner(signer)

      const address = await signer.getAddress()
      setAddress(address)
    }
  }

  return (
    <div className="connect-wallet-button-wraper">
      <Button onClick={() => connectMetaMask()}>{signer ? `${address?.slice(0, 4) + "..." + address?.slice(-5)}` : "Connect Wallet"}</Button>
      {balance && <span>{`Balance: ${balance}`}</span>}
    </div>
  )
}
