const { run } = require("hardhat")

const verify = async (address, constructorArguments) => {
    try {
        await run("verify:verify", {
            address,
            constructorArguments,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("already verified")
        } else {
            console.log(e)
        }
    }
}
module.exports = {
    verify,
}
