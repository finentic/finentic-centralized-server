const { providers } = require('ethers')
const { NETWORK_ID, API_WS_ENDPOINT } = require('../configs/constants')
const { collectionFactoryJobs } = require('./collection-factory.jobs')
const { controlCenterJobs } = require("./control-center.jobs")
const { marketplaceJobs } = require('./marketplace.jobs')
const { sharedJobs } = require('./shared.jobs')

let provider
const thirtyMinutes = 1000 * 60 * 30 // 1000ms * 60s * 30m
const threeMinutes = 3 * 60 * 1000 // 3 min x 60 sec x 1000ms

const triggerJobs = async () => {
    provider = new providers.WebSocketProvider(API_WS_ENDPOINT)
    const network = await provider.getNetwork()
    if (network.chainId != NETWORK_ID) throw Error('Unsupported network ID ' + network.chainId)

    // reconnect web socket
    setInterval(() => {
        console.info('Server call interval 30 minutes to renew web socket')
        provider = new providers.WebSocketProvider(API_WS_ENDPOINT)
    }, thirtyMinutes)

    // call every 3 minutes to keep web socket alive
    setInterval(() => provider.getBlockNumber(), threeMinutes)

    collectionFactoryJobs(provider)
    controlCenterJobs(provider)
    marketplaceJobs(provider)
    sharedJobs(provider)
}

module.exports = {
    triggerJobs
}