import { ethers } from "ethers"
import { GetBalances } from "./erc20/GetBalances"
import { useAddress } from "../store/WalletStore"

export const connectWallet = async () => {
  const { setAddress } = useAddress.getState()
  try {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      setAddress(address)
      const currentBalances = await GetBalances(provider, signer, address)
      return currentBalances
    } else {
      console.log("MetaMask not installed; using read-only defaults")
    }
  } catch (error) {
    console.error("Error connecting wallet:", error)
  }
}
