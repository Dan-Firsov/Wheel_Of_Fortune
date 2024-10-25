import { ethers } from "ethers"
import { getSigContract } from "../../store/WalletStore"

export const wofGetBalance = async () => {
  try {
    const contract = await getSigContract()
    const balance = await contract.getBalance()
    if (balance) {
      return ethers.formatUnits(balance, 18)
    } else {
      return "0"
    }
  } catch (error) {
    console.error("Get Balance error:", error)
  }
}
