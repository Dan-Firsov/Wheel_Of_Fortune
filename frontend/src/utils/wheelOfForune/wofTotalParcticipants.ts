import { ethers } from "ethers"
import { useConnection, wofAddress } from "../../store/WalletStore"
import { WheelOfFortuneABI } from "../../assests/WheelOfFortuneABI"

export const TotalParcticipants = async () => {
  try {
    const { signer } = useConnection.getState()
    const contract = new ethers.Contract(wofAddress, WheelOfFortuneABI, signer)

    const totalParcticipants = await contract.getTotalPot()
    return totalParcticipants.length
  } catch (error: any) {
    throw error
  }
}
