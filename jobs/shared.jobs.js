const { constants } = require("ethers")
const { sharedContract } = require("../configs/contracts")
const { createCollectionForAccount } = require("../controllers/collection.controller")

const collectionFactoryJobs = async provider => {
    const SharedContract = sharedContract(provider)

    SharedContract.on(
        'Transfer',
        (from, to, tokenId) => {
            if (from == constants.AddressZero)
                createCollectionForAccount(from, to, tokenId)
        }
    )
}

module.exports = {
    collectionFactoryJobs
}