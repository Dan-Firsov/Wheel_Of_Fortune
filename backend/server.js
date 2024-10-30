const express = require("express")
const { ethers } = require("ethers")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT

app.use(cors())

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const { abi } = require("./WheelOfFortune.json")
const contract = new ethers.Contract(process.env.CONTRACTADDRESS, abi, wallet)

app.post("/spinWheel", async (req, res) => {
  try {
    const tx = await contract.spinWheel()
    await tx.wait()
    res.json({ success: true, message: "Wheel spun successfully", txHash: tx.hash })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post("/createGameSession", async (req, res) => {
  try {
    const tx = await contract.createGameSession()
    await tx.wait()
    res.json({ success: true, txHash: tx.hash })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
