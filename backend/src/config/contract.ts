import { ethers } from "ethers"
import { abi } from "../WheelOfFortune.json"
import dotenv from "dotenv"

dotenv.config()

let contract: ethers.Contract
let provider: ethers.JsonRpcProvider

export function initializeContract() {
  if (!contract) {
    if (!process.env.RPC_URL || !process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
      throw new Error("RPC_URL, PRIVATE_KEY, and CONTRACT_ADDRESS must be defined in the .env file")
    }
    provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet)
    console.log("Contract initialized")
  }
}

export function getContract() {
  return contract
}
export function getProvider() {
  return provider
}
