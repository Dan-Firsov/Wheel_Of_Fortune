import { parseUnits } from "ethers"
import { useSigContract } from "../../hooks/useSigContract"

export const Transfer = async (addressTo: string, tokenValue: string) => {
  try {
    const contract = await useSigContract()
    const amount = parseUnits(tokenValue, 18)
    if (contract) {
      const tx = await contract.transfer(addressTo, amount)
      await tx.wait()
    }
  } catch (error) {
    console.error("Transfer token error:", error)
  }
}
