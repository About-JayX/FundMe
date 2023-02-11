const { getNamedAccounts, ethers, deployments } = require("hardhat")

async function main() {
    // 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
    const { deployer } = await getNamedAccounts()
    await deployments.fixture(["all"])
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("支付合同...", fundMe)
    const sendValue = ethers.utils.parseEther("0.5")
    const transactionResponse = await fundMe.fund({
        value: sendValue,
    })
    await transactionResponse.wait(1)
    console.log("支付成功...")
}
main()
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
