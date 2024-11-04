import { parseUnits } from "ethers"
import { useContractStore } from "../../store/ConnectionStore"

export const Deposit = async (value: string) => {
  const { sigContract } = useContractStore.getState()

  try {
    const amount = parseUnits(value, 18)
    if (sigContract) {
      const tx = await sigContract.deposit({ value: amount })
      await tx.wait()
    }
  } catch (error) {
    console.error("Deposit error:", error)
  }
}
