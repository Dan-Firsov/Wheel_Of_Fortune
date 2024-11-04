import { ethers } from "ethers"
import { useContractStore } from "../../store/ConnectionStore"

export const wofGetBalance = async () => {
  const { sigContract } = useContractStore.getState()
  try {
    if (sigContract) {
      const balance = await sigContract.getBalance()
      if (balance) {
        return ethers.formatUnits(balance, 18)
      } else {
        return "0"
      }
    }
  } catch (error) {
    console.error("Get Balance error:", error)
  }
}
