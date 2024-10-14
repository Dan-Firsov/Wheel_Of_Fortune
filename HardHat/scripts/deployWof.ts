import { ethers } from "hardhat"

const hre = require("hardhat")

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log("Deploying contracts with the account:", deployer.address)

  const WheelOfFortune = await hre.ethers.getContractFactory("WheelOfFortune")
  const wheelOfFortune = await WheelOfFortune.deploy()

  await wheelOfFortune.deployed()

  console.log("WheelOfFortune deployed to", wheelOfFortune.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
