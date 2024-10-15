import { ethers } from "ethers"
import { useConnection, wofAddress } from "../../store/WalletStore"
import { WheelOfFortuneABI } from "../../assests/WheelOfFortuneABI"

export const TotalPot = async () => {
  try {
    const { signer } = useConnection.getState()
    const contract = new ethers.Contract(wofAddress, WheelOfFortuneABI, signer)

    const totalPot = await contract.getTotalPot()
    return totalPot
  } catch (error: any) {
    throw error
  }
}
