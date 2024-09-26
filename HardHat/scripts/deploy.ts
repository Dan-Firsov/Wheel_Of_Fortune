import { ethers } from "hardhat"

const hre = require("hardhat")

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log("Deploying contracts with the account:", deployer.address)

  const WildToken = await hre.ethers.getContractFactory("WildToken")
  const wildToken = await WildToken.deploy(deployer)

  await wildToken.deploy

  console.log("WildToken deployed to", wildToken.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
