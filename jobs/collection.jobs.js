const { constants, Contract } = require("ethers")
const { sharedContract, MARKETPLACE_ADDRESS, Collection } = require("../configs/contracts")
const { updateState, updateOwnerAndState } = require("../controllers/item.controller")
const { ITEM_STATE } = require("../configs/constants")

const collectionJob = async (provider, collectionAddress) => {
    const CollectionContract = new Contract(collectionAddress, Collection.abi, provider)

    CollectionContract.on(
        'Transfer',
        async (from, to, tokenId, event) => {
            to = to.toLowerCase()
            console.log(
                'NFT Collection Transfer(',
                from.toLowerCase(),
                to.toLowerCase(),
                tokenId.toString(),
                ')',
            )

            // mint
            if (from == constants.AddressZero) {
                const timestamp = (await provider.getBlock(event.blockNumber)).timestamp;
                return updateOwnerAndState(
                    collectionAddress.toLowerCase(),
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
                    collectionAddress.toLowerCase(),
                    tokenId.toString(),
                    to.toLowerCase(),
                    ITEM_STATE.CREATED,
                    event.transactionHash,
                    timestamp
                )
            }
        }
    )

    return CollectionContract
}

module.exports = {
    collectionJob,
}