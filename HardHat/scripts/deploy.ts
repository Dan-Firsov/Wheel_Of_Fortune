import { ethers } from "hardhat"

async function main() {
  console.log("Starting deployment...")
  const WheelOfFortune = await ethers.getContractFactory("WheelOfFortune")
  console.log("Contract factory loaded")
  const wheelOfFortune = await WheelOfFortune.deploy()
  console.log("Deploy transaction sent. Waiting for deployment...")
  await wheelOfFortune.waitForDeployment()
  console.log("WheelOfFortune deployed to:", wheelOfFortune.target)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
