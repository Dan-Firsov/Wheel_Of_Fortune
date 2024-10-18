import { useEffect, useState } from "react"
import WofConnectWalletButton from "../connectWalletButton/wheelOfForune/wofConnectWalletButton"
import "./Header.css"
import { ethers } from "ethers"
import { wofAddress } from "../../store/WalletStore"
import { createSecureContext } from "tls"

export default function Header() {
  const [contractBalance, setContractBalance] = useState<string>("")
  useEffect(() => {
    const fetchContractBalance = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(wofAddress)
      setContractBalance(ethers.formatUnits(balance, 18))
    }
    fetchContractBalance()
  })
  return (
    <div className="container">
      <div>Contract Balance: {contractBalance ? `${contractBalance} ETH` : "Loading..."}</div>
      <WofConnectWalletButton></WofConnectWalletButton>
    </div>
  )
}
