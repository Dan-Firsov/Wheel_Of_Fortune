import { ethers, parseUnits } from "ethers"
import { WildTokenABI } from "../../assests/WildTokenABI"
import { tokenAddress, useConnection } from "../../store/WalletStore"

export const Transfer = async (addressTo: string, tokenValue: string) => {
  const { signer } = useConnection.getState()
  const contract = new ethers.Contract(tokenAddress, WildTokenABI, signer)

  const makeTokenTransfer = async () => {
    const amount = parseUnits(tokenValue, 18)

    const tx = await contract.transfer(addressTo, amount)
    await tx.wait()
  }
  makeTokenTransfer()
}
