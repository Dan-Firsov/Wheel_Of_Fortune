import { getContract } from "../config/contract"

export async function selectWinner() {
  const contract = getContract()
  if (!contract) {
    throw new Error("Contract is not initialized")
  }
  try {
    const tx = await contract.spinWheel({
      gasLimit: 1000000,
    })
    await tx.wait()
    console.log(`The winner has been chosen! txHash: ${tx.hash} `)
  } catch (error) {
    console.error("Winner selection error:", error)
  }
}
export async function createNewGameSession() {
  const contract = getContract()
  if (!contract) {
    throw new Error("Contract is not initialized")
  }
  try {
    const tx = await contract.createGameSession()
    await tx.wait()
    console.log(`The new game session has been chosen! txHash: ${tx.hash} `)
  } catch (error) {
    console.error("Winner selection error:", error)
  }
}
