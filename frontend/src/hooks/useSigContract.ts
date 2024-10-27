import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { WOF_ABI, WOF_ADDRESS } from "../store/WalletStore"

let sigContract: ethers.Contract | null = null

export const useSigContract = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(sigContract)

  useEffect(() => {
    const fetchSigContract = async () => {
      if (!contract) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contractInstance = new ethers.Contract(WOF_ADDRESS, WOF_ABI, signer)
        sigContract = contractInstance
        setContract(contractInstance)
      }
    }
    fetchSigContract()
  }, [contract])

  return contract
}
