const { constants } = require("ethers")
const { sharedContract, SHARED_ADDRESS, MARKETPLACE_ADDRESS } = require("../configs/contracts")
const { updateState, updateOwner } = require("../controllers/item.controller")
const { ITEM_STATE } = require("../configs/constants")

const sharedJobs = async provider => {
    const SharedContract = sharedContract(provider)

    SharedContract.on(
        'Transfer',
        async (from, to, tokenId, event) => {
            // mint
            if (from == constants.AddressZero) {
                const timestamp = (await provider.getBlock(event.blockNumber)).timestamp;
                await updateState(from, tokenId, ITEM_STATE[0])
                await updateOwner(
                    SHARED_ADDRESS,
                    tokenId,
                    to,
                    event.transactionHash,
                    timestamp
                )
                return
            }

            // burn
            if (to == constants.AddressZero) return updateState(from, tokenId, ITEM_STATE[5])

            if (to == MARKETPLACE_ADDRESS) return;

            const timestamp = (await provider.getBlock(event.blockNumber)).timestamp;
            updateOwner(
                SHARED_ADDRESS,
                tokenId,
                to,
                event.transactionHash,
                timestamp
            )
        }

    )
}

module.exports = {
    sharedJobs
}