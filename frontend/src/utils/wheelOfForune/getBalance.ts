import { ethers } from "ethers"
import { useContractStore, useWallet } from "../../store/ConnectionStore"

export const GetBalance = async () => {
  const { sigContract } = useContractStore.getState()
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
    console.error("Get Balance error:", error)
  }
}
