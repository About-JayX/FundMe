const networkConfig = {
    5: {
        name: "goerli",
        etherUsdPriceFeed: "0xd4a33860578de61dbabdc8bfdb98fd742fa7028e",
    },
}
const devChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000
module.exports = {
    networkConfig,
    devChains,
    DECIMALS,
    INITIAL_ANSWER,
}
