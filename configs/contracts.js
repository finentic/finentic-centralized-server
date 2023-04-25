const { Contract } = require('ethers')
const ControlCenter = require('../contracts/access/ControlCenter.json')
const Marketplace = require('../contracts/marketplace/Marketplace.json')
const Collection = require('../contracts/nft/Collection.json')
const CollectionFactory = require('../contracts/nft/CollectionFactory.json')
const Shared = require('../contracts/nft/Shared.json')
const VietnameseDong = require('../contracts/payment/VietnameseDong.json')

const {
    CONTROL_CENTER_ADDRESS,
    VIETNAMESE_DONG_ADDRESS,
    SHARED_ADDRESS,
    COLLECTION_ADDRESS,
    COLLECTION_FACTORY_ADDRESS,
    TREASURY_ADDRESS,
    MARKETPLACE_ADDRESS,
} = process.env

const controlCenterContract = provider => new Contract(CONTROL_CENTER_ADDRESS, ControlCenter.abi, provider)
const marketplaceContract = provider => new Contract(MARKETPLACE_ADDRESS, Marketplace.abi, provider)
const sharedContract = provider => new Contract(SHARED_ADDRESS, Shared.abi, provider)


module.exports = {
    ControlCenter,
    Marketplace,
    Collection,
    CollectionFactory,
    Shared,
    VietnameseDong,
    CONTROL_CENTER_ADDRESS,
    VIETNAMESE_DONG_ADDRESS,
    SHARED_ADDRESS,
    COLLECTION_ADDRESS,
    COLLECTION_FACTORY_ADDRESS,
    TREASURY_ADDRESS,
    MARKETPLACE_ADDRESS,
    controlCenterContract,
    marketplaceContract,
    sharedContract,
}