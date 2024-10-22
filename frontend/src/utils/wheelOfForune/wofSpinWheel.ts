import { ethers, parseUnits } from "ethers"
import { useConnection, wofAddress } from "../../store/WalletStore"
import { WheelOfFortuneABI } from "../../assests/WheelOfFortuneABI"

export const SpinWheel = async () => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(wofAddress, WheelOfFortuneABI, provider)

    const tx = await contract.spinWheel()
    await tx.wait()
  } catch (error: any) {
    throw error
  }
}
