import { ethers } from "ethers"
import { WildTokenABI } from "../assests/WildTokenABI"

export async function getTokenBalance(address: string, tokenAddres: string, signer: ethers.JsonRpcSigner) {
  const contract = new ethers.Contract(tokenAddres, WildTokenABI, signer)
  const balance = await contract.balanceOf(address)
  return ethers.formatUnits(balance, 18)
}
