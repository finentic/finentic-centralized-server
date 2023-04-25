const { controlCenterContract } = require("../configs/contracts")

const controlCenterJobs = async provider => {
    const ControlCenterContract = controlCenterContract(provider)
    ControlCenterContract.on('AddToWhitelist', account => {
        console.log(account)
    })
}

module.exports = {
    controlCenterJobs
}