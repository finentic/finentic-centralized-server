const {
    getAccount,
    updateAvatar,
    updateName,
    updateBio,
    updateExternalUrl,
    create,
} = require("../controllers/account.controller")

const {
    createItem,
    getItemById,
    getItemsFixedPrice,
    getItemsAuction,
    searchItem,
    getItems,
    getRawMetadata,
    getItemByIdForUpdate,
    updateItemById,

    getAllItemsOfAccount,
    getAllItemsFixedPriceListingOfAccount,
    getAllItemsAuctionListingOfAccount,
    getAllItemsCreatedOfAccount,
    getAllItemOfCollection,

    getAllPurchaseItemsOfAccount,
    getAllCanceledPurchaseItemsOfAccount,
    getAllDeliveredPurchaseItemsOfAccount,
    getAllShippingPurchaseItemsOfAccount,

    getAllCanceledSalesItemsOfAccount,
    getAllDeliveredSalesItemsOfAccount,
    getAllSalesItemsOfAccount,
    getAllShippingSalesItemsOfAccount,
    searchItemAuction,
    searchItemFixedPrice,
    searchItemByAddress,
} = require("../controllers/item.controller")

const {
    createCollection,
    getCollectionById,
    updateCollectionDescription,
    updateCollectionPicture,
    getAllCollectionOfAccount,
    getAllCollections,
    searchCollection,
} = require("../controllers/nft-collection.controller")

const routers = (app) => {
    app.get('/', (_req, res) => res.status(200).json('Finentic centralized server is running.'))

    app.get('/accounts/random', create)
    app.get('/accounts/profile', getAccount)
    app.post('/accounts/update-avatar', updateAvatar)
    app.post('/accounts/update-name', updateName)
    app.post('/accounts/update-bio', updateBio)
    app.post('/accounts/update-external-url', updateExternalUrl)

    app.get('/items/account', getAllItemsOfAccount)
    app.get('/items/account/fixed-price', getAllItemsFixedPriceListingOfAccount)
    app.get('/items/account/auction', getAllItemsAuctionListingOfAccount)
    app.get('/items/account/created', getAllItemsCreatedOfAccount)

    app.get('/items/account/orders/purchase', getAllPurchaseItemsOfAccount)
    app.get('/items/account/orders/purchase/canceled', getAllCanceledPurchaseItemsOfAccount)
    app.get('/items/account/orders/purchase/delivered', getAllDeliveredPurchaseItemsOfAccount)
    app.get('/items/account/orders/purchase/shipping', getAllShippingPurchaseItemsOfAccount)

    app.get('/items/account/orders/sales', getAllSalesItemsOfAccount)
    app.get('/items/account/orders/sales/canceled', getAllCanceledSalesItemsOfAccount)
    app.get('/items/account/orders/sales/delivered', getAllDeliveredSalesItemsOfAccount)
    app.get('/items/account/orders/sales/shipping', getAllShippingSalesItemsOfAccount)

    app.get('/items/search', searchItem)
    app.get('/items/search/auction', searchItemAuction)
    app.get('/items/search/fixed-price', searchItemFixedPrice)
    app.get('/items/search/address', searchItemByAddress)

    app.get('/items/detail', getItemById)
    app.get('/items/explore', getItems)
    app.get('/items/explore/fixed-price', getItemsFixedPrice)
    app.get('/items/explore/auction', getItemsAuction)

    app.post('/items/create', createItem)
    app.get('/items/raw/:item_id', getRawMetadata)
    app.get('/items/update/:item_id', getItemByIdForUpdate)
    app.post('/items/update', updateItemById)
    app.get('/items/collection', getAllItemOfCollection)

    app.get('/collections/search', searchCollection)
    app.get('/collections/explore', getAllCollections)
    app.get('/collections', getCollectionById)
    app.get('/collections/account', getAllCollectionOfAccount)
    app.post('/collections/create', createCollection)
    app.post('/collections/update-description', updateCollectionDescription)
    app.post('/collections/update-picture', updateCollectionPicture)
}

module.exports = {
    routers
}