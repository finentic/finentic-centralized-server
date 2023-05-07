const {
    getAccount,
    updateAvatar,
    updateName,
    updateBio,
    updateExternalUrl,
    create,
} = require("../controllers/account.controller")
const { createItem, getItemById, createItemSingle, searchItem, getItems, getRawMetadata, getItemByIdForUpdate, updateItemById } = require("../controllers/item.controller")

const routers = (app) => {
    app.get('/', (_req, res) => res.status(200).json('Finentic centralized server is running.'))

    app.get('/accounts/random', create)
    app.get('/accounts/profile', getAccount)
    app.post('/accounts/update-avatar', updateAvatar)
    app.post('/accounts/update-name', updateName)
    app.post('/accounts/update-bio', updateBio)
    app.post('/accounts/update-external-url', updateExternalUrl)

    app.get('/items/detail', getItemById)
    app.post('/items/create', createItem)
    app.get('/items/search', searchItem)
    app.get('/items/explore', getItems)
    app.get('/items/raw/:item_id', getRawMetadata)
    app.get('/items/update/:item_id', getItemByIdForUpdate)
    app.post('/items/update', updateItemById)

}

module.exports = {
    routers
}