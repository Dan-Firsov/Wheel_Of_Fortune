import { ethers, parseUnits } from "ethers"
import { useConnection, wofAddress } from "../../store/WalletStore"
import { WheelOfFortuneABI } from "../../assests/WheelOfFortuneABI"

export const PlaceBet = async (value: string) => {
  try {
    const { signer } = useConnection.getState()
    const contract = new ethers.Contract(wofAddress, WheelOfFortuneABI, signer)

    const amount = parseUnits(value, 18)

    const tx = await contract.placeBet(amount)
    await tx.wait()
  } catch (error: any) {
    throw error
  }
}
