import { getBrowsProvider, useAddress } from "../store/WalletStore"
import { wofGetBalance } from "./wheelOfForune/wofGetBalance"

export const wofConnectWallet = async () => {
  const { setAddress } = useAddress.getState()
  try {
    if (window.ethereum) {
      const provider = await getBrowsProvider()
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      setAddress(address)
      const currentBalance = await wofGetBalance()
      return currentBalance
    } else {
      console.log("MetaMask not installed; using read-only defaults")
    }
  } catch (error) {
    console.error("Error connecting wallet:", error)
  }
}
