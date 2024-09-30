import { ethers } from "ethers"
import { setConnection } from "../store/store"

export const connectWallet = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const address = await signer.getAddress()

  setConnection({ provider, signer, address })
}
