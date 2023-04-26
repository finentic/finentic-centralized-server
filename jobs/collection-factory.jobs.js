const { collectionFactoryContract } = require("../configs/contracts")
const { createCollectionForAccount } = require("../controllers/collection.controller")

const collectionFactoryJobs = async provider => {
    const CollectionFactoryContract = collectionFactoryContract(provider)

    CollectionFactoryContract.on(
        'CollectionCreated',
        (collection, creator, name, symbol) => createCollectionForAccount(collection, creator, name, symbol)
    )
}

module.exports = {
    collectionFactoryJobs
}