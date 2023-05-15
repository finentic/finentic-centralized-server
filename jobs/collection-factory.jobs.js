const { collectionFactoryContract } = require("../configs/contracts")
const { createCollectionForAccount } = require("../controllers/nft-collection.controller")

const collectionFactoryJobs = async provider => {
    const CollectionFactoryContract = collectionFactoryContract(provider)

    CollectionFactoryContract.on('CollectionCreated',
        (collection, creator, name, symbol) => {
            console.log(
                'createCollectionForAccount(',
                collection,
                creator,
                name,
                symbol,
                ')',
            )
            createCollectionForAccount(collection, creator, name, symbol)
        }
    )

    return CollectionFactoryContract
}

module.exports = {
    collectionFactoryJobs
}