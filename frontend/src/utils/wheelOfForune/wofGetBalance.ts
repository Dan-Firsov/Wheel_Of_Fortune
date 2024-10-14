import { BrowserProvider, JsonRpcSigner, ethers } from "ethers"
import { WheelOfFortuneABI } from "../../assests/WheelOfFortuneABI"
import { wofAddress } from "../../store/WalletStore"

export const wofGetBalance = async (provider: BrowserProvider, signer: JsonRpcSigner) => {
  const connect = new ethers.Contract(wofAddress, WheelOfFortuneABI, signer)
  const balance = await connect.getBalance()

  if (balance) {
    return ethers.formatUnits(balance, 18)
  } else {
    return "0"
  }
}
