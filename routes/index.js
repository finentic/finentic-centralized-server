const routers = (app) => {
    app.get('/', (_req, res) => res.status(200).json('Finentic centralized server is running.'))
}

module.exports = {
    routers
}