import { parseUnits } from "ethers"
import { getSigContract } from "../../store/WalletStore"

export const Transfer = async (addressTo: string, tokenValue: string) => {
  try {
    const contract = await getSigContract()
    const amount = parseUnits(tokenValue, 18)
    const tx = await contract.transfer(addressTo, amount)
    await tx.wait()
  } catch (error) {
    console.error("Transfer token error:", error)
  }
}
