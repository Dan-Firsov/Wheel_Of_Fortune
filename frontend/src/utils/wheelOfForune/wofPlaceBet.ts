import { parseUnits } from "ethers"
import { getSigContract } from "../../store/WalletStore"

export const PlaceBet = async (value: string) => {
  try {
    const contract = await getSigContract()
    const amount = parseUnits(value, 18)
    const tx = await contract.placeBet(amount)
    await tx.wait()
  } catch (error: any) {
    throw error
  }
}
