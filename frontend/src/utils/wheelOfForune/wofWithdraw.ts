import { parseUnits } from "ethers"
import { getSigContract } from "../../store/WalletStore"

export const Withdraw = async (value: string) => {
  try {
    const contract = await getSigContract()
    const amount = parseUnits(value, 18)
    const tx = await contract.withdraw(amount)
    await tx.wait()
  } catch (error: any) {
    throw error
  }
}
