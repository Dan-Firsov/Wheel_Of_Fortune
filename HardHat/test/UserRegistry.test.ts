import { loadFixture, ethers, expect } from "./Setup"

describe("UserRegistry", function () {
  async function deploy() {
    const [user1, user2] = await ethers.getSigners()

    const Factory = await ethers.getContractFactory("UserRegistry")
    const userRegistry = await Factory.deploy()
    await userRegistry.waitForDeployment()

    return { user1, user2, userRegistry }
  }

  it("should be added name and age", async function () {
    const { userRegistry } = await loadFixture(deploy)
    await userRegistry.setInfo("Dasha", 28)
    const userInfo = await userRegistry.checkInfo()
    expect(userInfo[0]).to.equal("Dasha")
    expect(userInfo[1]).to.equal(28)
  })
})
