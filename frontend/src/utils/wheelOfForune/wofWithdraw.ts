import { parseUnits } from "ethers"
import { useContractStore } from "../../store/ConnectionStore"

export const Withdraw = async (value: string) => {
  const { sigContract } = useContractStore.getState()
  try {
    const amount = parseUnits(value, 18)
    if (sigContract) {
      const tx = await sigContract.withdraw(amount)
      await tx.wait()
    }
  } catch (error: any) {
    throw error
  }
}
