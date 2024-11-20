import { ethers } from "ethers"
import { useWallet, useContractStore } from "../store/ConnectionStore"
import { GetBalance } from "./wheelOfForune/getBalance"
import { checkAndSwitchNetwork } from "./checkAndSwitchNetwork"

export const connectWallet = async () => {
  const { setAddress } = useWallet.getState()
  const { setBrowsContract, setSigContract } = useContractStore.getState()
  try {
    if (window.ethereum) {
      const isNetworkReady = await checkAndSwitchNetwork()
      if (!isNetworkReady) {
        console.error("Failed to switch to the required network.")
        return
      }

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
