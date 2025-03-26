import { ethers } from "ethers"
import { useConnectionStore, useWallet } from "../../store/ConnectionStore"

export const getBalance = async () => {
  const { sigContract } = useConnectionStore.getState()
  const { setBalance } = useWallet.getState()
  try {
    if (sigContract) {
      const balance = await sigContract.getBalance()
      if (balance) {
        const currentBalance = ethers.formatUnits(balance, 18)
        setBalance(currentBalance)
      } else {
        return "0"
      }
    }
  } catch (error) {
    console.error("Get balance error:", error)
  }
}
