const { network } = require("hardhat")
const {
    devChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, deployments }) => {
    // 使用本地网络的时候使用mock
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    // const chainId = network.config.chainId
    if (devChains.includes(network.name)) {
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
            waitConfirmations: network.config.blockConfirmations || 1,
        })
        log("正在部署合约...")
    }
}
module.exports.tags = ["mocks", "all"]
