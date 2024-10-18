import { ethers } from "ethers"
import { useAddress, useConnection } from "../store/WalletStore"
import { wofGetBalance } from "./wheelOfForune/wofGetBalance"

export const wofConnectWallet = async (): Promise<string | undefined> => {
  const { setAddress } = useAddress.getState()
  const { setConnection } = useConnection.getState()

  try {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const address = await signer.getAddress()
      setAddress(address)
      setConnection(provider, signer)
      const currentBalance = await wofGetBalance(signer)
      console.log(currentBalance)

      return currentBalance
    } else {
      console.log("MetaMask not installed; using read-only defaults")
    }
  } catch (error) {
    console.error("Error connecting wallet:", error)
  }
}
