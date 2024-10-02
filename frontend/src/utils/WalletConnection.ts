import { ethers } from "ethers"
import { useAddress, useConnection } from "../store/WalletStore"

export const WalletConnection = () => {
  const { setAddress } = useAddress()
  const { setConnection } = useConnection()

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()

        if (provider && signer && address) {
          setConnection(provider, signer)
          setAddress(address)

          return { provider, signer, address }
        } else {
          console.log("Provider and signer not detected")
          return null
        }
      } else {
        console.log("MetaMask not installed; using read-only defaults")
        return null
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      return null
    }
  }
  return { connectWallet }
}
