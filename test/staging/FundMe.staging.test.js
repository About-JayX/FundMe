const { inputToConfig } = require("@ethereum-waffle/compiler")
const { assert } = require("chai")
const { getNamedAccounts, ethers, network } = require("hardhat")
const { devChains } = require("../../helper-hardhat-config")
devChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let FundMe, deployer
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              //   连接到合约
              FundMe = await ethers.getContract("FundMe", deployer)
              console.log(FundMe.address)
          })

          it("发送和提取", async () => {
              await FundMe.fund({ value: sendValue })
              await FundMe.withdraw()
              const endingBalance = await FundMe.provider.getBalance(
                  FundMe.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
