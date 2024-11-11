import { useEffect, useState } from "react"
import "./Header.css"
import { ethers } from "ethers"
import { WOF_ADDRESS } from "../../store/ConnectionStore"
import ConnectWalletButton from "../wallet/сonnectWalletButton"

export default function Header() {
  const [contractBalance, setContractBalance] = useState<string>("")
  useEffect(() => {
    const fetchContractBalance = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(WOF_ADDRESS)
      setContractBalance(ethers.formatUnits(balance, 18))
    }
    fetchContractBalance()
  })
  return (
    <div className="header-container">
      <p>Wheel Of Fortune</p>
      <div>Contract Balance: {contractBalance ? `${contractBalance} ETH` : "Loading..."}</div>
      <ConnectWalletButton></ConnectWalletButton>
    </div>
  )
}
