import { ConnectStore, tokenAddress } from "../store/store"
import { getTokenBalance } from "./getTokenBalance"
import { ethers, formatEther } from "ethers"

export const setBalances = async (address: string, signer: ethers.JsonRpcSigner, provider: ethers.BrowserProvider): Promise<{ userTokenBalance: string; balance: string } | null> => {
  const userTokenBalance = await getTokenBalance(address, tokenAddress, signer)
  const balance = formatEther(await provider.getBalance(address))
  if (userTokenBalance && balance) {
    return { userTokenBalance, balance }
  }
  return null
}
