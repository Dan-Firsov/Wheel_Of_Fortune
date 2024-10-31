import { ethers } from "ethers"
import { abi } from "../WheelOfFortune.json"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.RPC_URL || !process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
  throw new Error("RPC_URL, PRIVATE_KEY, and CONTRACT_ADDRESS must be defined in the .env file")
}

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet)

export default contract
