import { parseUnits } from "ethers"
import { useConnectionStore } from "../../store/ConnectionStore"

export const withdraw = async (value: string) => {
  const { sigContract } = useConnectionStore.getState()
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
