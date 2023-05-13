const { constants } = require("ethers")
const { sharedContract, SHARED_ADDRESS, MARKETPLACE_ADDRESS } = require("../configs/contracts")
const { updateState, updateOwnerAndState } = require("../controllers/item.controller")
const { ITEM_STATE } = require("../configs/constants")

const sharedJobs = async provider => {
    const SharedContract = sharedContract(provider)

    SharedContract.on(
        'Transfer',
        async (from, to, tokenId, event) => {
            to = to.toLowerCase()
            console.log(
                'Shared Transfer(',
                from.toLowerCase(),
                to.toLowerCase(),
                tokenId.toString(),
                ')',
            )

            // mint
            if (from == constants.AddressZero) {
                const timestamp = (await provider.getBlock(event.blockNumber)).timestamp;
                return updateOwnerAndState(
                    SHARED_ADDRESS.toLowerCase(),
                    tokenId.toString(),
                    to.toLowerCase(),
                    ITEM_STATE.CREATED,
                    event.transactionHash,
                    timestamp
                )
            }

            // burn
            if (to == constants.AddressZero) return updateState(
                from.toLowerCase(),
                tokenId.toString(),
                ITEM_STATE.HIDDEN,
            )

            if (to.toLowerCase() != MARKETPLACE_ADDRESS.toLowerCase()) {
                const timestamp = (await provider.getBlock(event.blockNumber)).timestamp;
                return updateOwnerAndState(
                    SHARED_ADDRESS.toLowerCase(),
                    tokenId.toString(),
                    to.toLowerCase(),
                    ITEM_STATE.CREATED,
                    event.transactionHash,
                    timestamp
                )
            }
        }
    )

    return SharedContract
}

module.exports = {
    sharedJobs,
}