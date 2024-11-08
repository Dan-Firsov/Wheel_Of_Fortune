import { ethers } from "ethers"
import { useWallet, useContractStore } from "../store/ConnectionStore"
import { GetBalance } from "./wheelOfForune/getBalance"

export const connectWallet = async () => {
  const { setAddress } = useWallet.getState()
  const { setBrowsContract, setSigContract } = useContractStore.getState()
  try {
    if (window.ethereum) {
      await setBrowsContract()
      await setSigContract()
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      setAddress(address)
      GetBalance()
    } else {
      console.log("MetaMask not installed; using read-only defaults")
    }
  } catch (error) {
    console.error("Error connecting wallet:", error)
  }
}
