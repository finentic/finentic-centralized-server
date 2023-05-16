const { providers } = require('ethers')
const { NETWORK_ID, API_WS_ENDPOINT, ITEM_STATE } = require('../configs/constants')
const { collectionFactoryJobs } = require('./collection-factory.jobs')
const { controlCenterJobs } = require("./control-center.jobs")
const { marketplaceJobs } = require('./marketplace.jobs')
const { sharedJobs } = require('./shared.jobs')
const { NftCollection } = require('../models')
const { SHARED_ADDRESS } = require('../configs/contracts')
const { collectionJob } = require('./collection.jobs')

const intervalTime = 1000 * 60 * 5 // 1000ms * 60s * 10m

const triggerJobs = async () => {
    let provider = new providers.WebSocketProvider(API_WS_ENDPOINT)
    const network = await provider.getNetwork()
    if (network.chainId != NETWORK_ID) throw Error('Unsupported network ID ' + network.chainId)

    collectionFactoryJobs(provider)
    controlCenterJobs(provider)
    marketplaceJobs(provider)
    sharedJobs(provider)

    const collectionsExists = await NftCollection.find({ state: { $ne: ITEM_STATE.HIDDEN } }).select({ _id: 1 }).exec()
    collectionsExists.forEach(collection => {
        if (collection._id.toLocaleLowerCase() != SHARED_ADDRESS.toLocaleLowerCase()) collectionJob(provider, collection._id)
    })

    // call interval to keep web socket alive
    setInterval(async () => {
        console.log('Call interval: ', await provider.getBlockNumber())
    }, intervalTime / 10)

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