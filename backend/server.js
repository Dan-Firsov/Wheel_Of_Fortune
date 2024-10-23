const express = require("express")
const { ethers } = require("ethers")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const { abi } = require("./WheelOfFortune.json")
const contract = new ethers.Contract(process.env.CONTRACTADDRESS, abi, wallet)

app.post("/spinWheel", async (req, res) => {
  try {
    const tx = await contract.spinWheel()
    await tx.wait()
    res.status(200).send("Wheel spun successfully")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
