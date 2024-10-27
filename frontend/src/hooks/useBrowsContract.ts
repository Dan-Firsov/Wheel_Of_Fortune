import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { WOF_ABI, WOF_ADDRESS } from "../store/WalletStore"

let browsContract: ethers.Contract | null = null

export const useBrowsContract = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(browsContract)

  useEffect(() => {
    if (!contract) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contractInstance = new ethers.Contract(WOF_ADDRESS, WOF_ABI, provider)
      browsContract = contractInstance
      setContract(contractInstance)
    }
  }, [contract])

  return contract
}
