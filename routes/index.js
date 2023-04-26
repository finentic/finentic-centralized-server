const {
    getAccount,
    updateAvatar,
    updateName,
    updateBio,
    updateExternalUrl,
    create,
} = require("../controllers/account.controller")

const routers = (app) => {
    app.get('/', (_req, res) => res.status(200).json('Finentic centralized server is running.'))

    app.get('/accounts/random', create)
    app.get('/accounts/profile', getAccount)
    app.post('/accounts/update-avatar', updateAvatar)
    app.post('/accounts/update-name', updateName)
    app.post('/accounts/update-bio', updateBio)
    app.post('/accounts/update-external-url', updateExternalUrl)

}

module.exports = {
    routers
}