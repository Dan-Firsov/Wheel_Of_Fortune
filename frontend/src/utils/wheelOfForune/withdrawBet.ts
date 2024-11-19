import { parseUnits } from "ethers"
import { useContractStore } from "../../store/ConnectionStore"

export const WithdrawBet = async (value: string) => {
  const { sigContract } = useContractStore.getState()
  try {
    const amount = parseUnits(value, 18)
    if (sigContract) {
      const tx = await sigContract.withdrawBet(amount)
      await tx.wait()
    }
  } catch (error) {
    throw error
  }
}
