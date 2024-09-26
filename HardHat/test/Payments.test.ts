import { loadFixture, ethers, expect } from "./Setup"

describe("Payments", function () {
  async function deploy() {
    const [user1, user2] = await ethers.getSigners()

    const Factory = await ethers.getContractFactory("Payments")
    const payments = await Factory.deploy()
    await payments.waitForDeployment()

    return { user1, user2, payments }
  }

  it("should be deplyed", async function () {
    const { payments } = await loadFixture(deploy)

    expect(payments.target).to.be.properAddress
  })

  it("should have 0 ethers by default", async function () {
    const { payments } = await loadFixture(deploy)
    //const balance = await payments.currentBalance()
    const balance = await ethers.provider.getBalance(payments.target)
    expect(balance).to.eq(0)
  })
})
