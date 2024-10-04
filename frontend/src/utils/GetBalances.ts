import { WildTokenABI } from "../assests/WildTokenABI"
import { tokenAddress } from "../store/WalletStore"
import { BrowserProvider, ethers, formatEther, JsonRpcSigner } from "ethers"

export const GetBalances = async (provider: BrowserProvider, signer: JsonRpcSigner, address: string) => {
  async function getTokenBalance() {
    const contract = new ethers.Contract(tokenAddress, WildTokenABI, signer)
    const tokenBalance = await contract.balanceOf(address)

    if (tokenBalance) {
      return ethers.formatUnits(tokenBalance, 18)
    } else {
      console.log("Token balance error", `Contract: ${contract}, Balance: ${tokenBalance}`)
      return ""
    }
  }

  const balance = formatEther(await provider.getBalance(address))
  if (!balance) {
    console.log("Balance error")
  }
  const tokenBalance = await getTokenBalance()

  return { balance, tokenBalance }
}
