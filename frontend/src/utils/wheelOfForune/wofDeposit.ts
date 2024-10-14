import { ethers, parseUnits } from "ethers"
import { useConnection, wofAddress } from "../../store/WalletStore"
import { WheelOfFortuneABI } from "../../assests/WheelOfFortuneABI"

export const Deposit = async (value: string) => {
  const { signer } = useConnection.getState()
  const contract = new ethers.Contract(wofAddress, WheelOfFortuneABI, signer)

  const deposit = async () => {
    const amount = parseUnits(value, 18)
    console.log(amount)

    const tx = await contract.deposit({ value: amount })
    await tx.wait()
  }
  deposit()
}
