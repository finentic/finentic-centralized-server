const { providers } = require('ethers')
const {
    NETWORK_ID,
    API_WS_ENDPOINT,
    ITEM_STATE,
    SHARED_COLLECTION_DOCUMENT_DEFAULT,
    ACCOUNT_DOCUMENT_DEFAULT,
} = require('../configs/constants')
const { collectionFactoryJobs } = require('./collection-factory.jobs')
const { controlCenterJobs } = require("./control-center.jobs")
const { marketplaceJobs } = require('./marketplace.jobs')
const { sharedJobs } = require('./shared.jobs')
const { NftCollection, Account } = require('../models')
const { SHARED_ADDRESS } = require('../configs/contracts')
const { collectionJob } = require('./collection.jobs')

const intervalTime = 1000 * 60 * 1 // 1000ms * 60s * 1m

const triggerJobs = async () => {
    let provider = new providers.WebSocketProvider(API_WS_ENDPOINT)
    const network = await provider.getNetwork()
    if (network.chainId != NETWORK_ID) throw Error('Unsupported network ID ' + network.chainId)

    collectionFactoryJobs(provider)
    controlCenterJobs(provider)
    marketplaceJobs(provider)
    sharedJobs(provider)

    // upsert database if not exists
    const defaultAccountExists = await Account.findById(ACCOUNT_DOCUMENT_DEFAULT._id.toLowerCase()).select({ _id: 1 }).exec()
    if (!defaultAccountExists) {
        const newAccount = new Account(ACCOUNT_DOCUMENT_DEFAULT)
        await Account.findByIdAndUpdate(newAccount._id, newAccount, { upsert: true }).exec()
        const new_account = await Account.findById(newAccount._id).exec()
        console.log(new_account)
    }
    const sharedCollectionExists = await NftCollection.findById(SHARED_COLLECTION_DOCUMENT_DEFAULT._id.toLowerCase()).select({ _id: 1 }).exec()
    if (!sharedCollectionExists) {
        const newCollection = new NftCollection(SHARED_COLLECTION_DOCUMENT_DEFAULT)
        await NftCollection.findByIdAndUpdate(newCollection._id, newCollection, { upsert: true }).exec()
        const new_collection = await NftCollection.findById(newCollection._id).exec()
        console.log(new_collection)
    }

    // listening all collections created from database
    const collectionsExists = await NftCollection.find({ state: { $ne: ITEM_STATE.HIDDEN } }).select({ _id: 1 }).exec()
    collectionsExists.forEach(collection => {
        if (collection._id.toLocaleLowerCase() != SHARED_ADDRESS.toLocaleLowerCase()) collectionJob(provider, collection._id)
    })

    // call interval to keep web socket alive
    setInterval(async () => {
        console.log('Call interval: ', await provider.getBlockNumber())
    }, intervalTime)

    provider._websocket.on("error", async () => {
        console.log(`Unable to connect to ${API_WS_ENDPOINT} retrying in 0s...`);
        triggerJobs()
    })

    provider._websocket.on("close", async (code) => {
        console.log(
            `Connection lost with code ${code}! Attempting reconnect in 0s...`
        );
        provider._websocket.terminate();
        triggerJobs()
    })
}

module.exports = {
    triggerJobs
}