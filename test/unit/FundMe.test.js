const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { devChains } = require("../../helper-hardhat-config")

!devChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe
          let deployer
          let MockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async () => {
              // const accounts = await ethers.getSigners()
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("constructor", async () => {
              it("address", async () => {
                  const resposne = await fundMe.getPriceFeed()
                  assert.equal(resposne, MockV3Aggregator.address)
              })
          })
          describe("fund", async () => {
              it("no enough ethers", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "没有足够的以太"
                  )
              })
              it("updata ethers", async () => {
                  await fundMe.fund({ value: sendValue })
                  const resposne = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(resposne.toString(), sendValue.toString())
              })
              it("add funder", async () => {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer)
              })
              describe("withdraw", async () => {
                  beforeEach(async () => {
                      await fundMe.fund({ value: sendValue })
                  })
                  it("test withdraw gas", async () => {
                      const startBalance = await fundMe.provider.getBalance(
                          fundMe.address
                      )
                      const startDeployBalance =
                          await fundMe.provider.getBalance(deployer)

                      const withdrawResponse = await fundMe.withdraw()
                      const withdrawReceipt = await withdrawResponse.wait(1)
                      const { gasUsed, effectiveGasPrice } = withdrawReceipt
                      const gasCost = gasUsed.mul(effectiveGasPrice)
                      const endBalance = await fundMe.provider.getBalance(
                          fundMe.address
                      )
                      const endDeployBalance = await fundMe.provider.getBalance(
                          deployer
                      )

                      assert.equal(
                          gasCost.add(endDeployBalance).toString(),
                          startBalance.add(startDeployBalance).toString()
                      )
                  })
              })
              it("lot of user test", async () => {
                  const accounts = await ethers.getSigners()
                  const psList = accounts.map((item) => {
                      return new Promise(async (re) => {
                          const fundMeConnectedContract = await fundMe.connect(
                              item
                          )
                          await fundMeConnectedContract.fund({
                              value: sendValue,
                          })
                          re()
                      })
                  })
                  Promise.all(psList)
                  const startBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startDeployBalance = await fundMe.provider.getBalance(
                      deployer
                  )
                  const withdrawResponse = await fundMe.withdraw()
                  const withdrawReceipt = await withdrawResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = withdrawReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endDeployBalance = await fundMe.provider.getBalance(
                      deployer
                  )
                  assert.equal(endBalance, 0)
                  assert.equal(
                      gasCost.add(endDeployBalance).toString(),
                      startBalance.add(startDeployBalance).toString()
                  )
                  await expect(fundMe.getFunder(0)).to.be.reverted
                  for (let i = 0; i < accounts.length; i++) {
                      const item = accounts[i]
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(item).address,
                          0
                      )
                  }
              })
              it("owner to withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const accountConnect = await fundMe.connect(attacker)
                  await expect(accountConnect.withdraw()).to.be.revertedWith(
                      "FundMe_NotOwner"
                  )
              })

              it("cheapper withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const psList = accounts.map((item) => {
                      return new Promise(async (re) => {
                          const fundMeConnectedContract = await fundMe.connect(
                              item
                          )
                          await fundMeConnectedContract.fund({
                              value: sendValue,
                          })
                          re()
                      })
                  })
                  Promise.all(psList)
                  const startBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startDeployBalance = await fundMe.provider.getBalance(
                      deployer
                  )
                  const withdrawResponse = await fundMe.cheaperWithdraw()
                  const withdrawReceipt = await withdrawResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = withdrawReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endDeployBalance = await fundMe.provider.getBalance(
                      deployer
                  )
                  assert.equal(endBalance, 0)
                  assert.equal(
                      gasCost.add(endDeployBalance).toString(),
                      startBalance.add(startDeployBalance).toString()
                  )
                  await expect(fundMe.getFunder(0)).to.be.reverted
                  for (let i = 0; i < accounts.length; i++) {
                      const item = accounts[i]
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(item).address,
                          0
                      )
                  }
              })
          })
      })
