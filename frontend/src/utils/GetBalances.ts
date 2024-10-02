import { WildTokenABI } from "../assests/WildTokenABI"
import { tokenAddress, useAddress, useConnection } from "../store/WalletStore"
import { ethers, formatEther } from "ethers"

export const GetBalances = async (provider: any, signer: any, address: any) => {
  async function getTokenBalance() {
    const contract = new ethers.Contract(tokenAddress, WildTokenABI, signer)
    const balance = await contract.balanceOf(address)
    return ethers.formatUnits(balance, 18)
  }

  const balance: string | null = provider && address ? formatEther(await provider.getBalance(address)) : null
  const tokenBalance = await getTokenBalance()

  if (balance) {
    return { balance, tokenBalance }
  } else {
    console.log("Balance Error")
    return null
  }
}
