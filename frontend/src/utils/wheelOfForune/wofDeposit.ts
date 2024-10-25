import { parseUnits } from "ethers"
import { getSigContract } from "../../store/WalletStore"

export const Deposit = async (value: string) => {
  try {
    const contract = await getSigContract()
    const amount = parseUnits(value, 18)
    const tx = await contract.deposit({ value: amount })
    await tx.wait()
  } catch (error) {
    console.error("Deposit error:", error)
  }
}
