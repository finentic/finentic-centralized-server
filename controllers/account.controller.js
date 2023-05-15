const { AVATAR_PATH, AVATAR_PATH_DB } = require('../configs/constants')
const { Account } = require('../models')
const fs = require('fs')
const path = require('path') // path for cut the file extension
const multer = require('multer')
const sharp = require('sharp')
const { Wallet } = require('ethers')

// ==== config  ====<
sharp.cache(false)

const storage = multer.diskStorage({
    destination: (req, _file, callBack) => {
        const dir = AVATAR_PATH + req.body.account_address.toLowerCase()
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        callBack(null, dir)
    },
    filename: (_req, file, callBack) => {
        // Overwriting the previous picture
        const fileName = 'picture' + path.extname(file.originalname)
        callBack(null, fileName)
    },
})

const uploadSingle = multer({
    fileFilter: (_req, file, callBack) => {
        if (
            file.mimetype == "image/png"
            || file.mimetype == "image/jpg"
            || file.mimetype == "image/jpeg"
        ) callBack(null, true)
        else {
            callBack(null, false)
            return callBack(new Error('Account: Only .png, .jpg and .jpeg format allowed!'))
        }
    },
    limits: {
        fileSize: (8 * 1024 * 1024) * 2, // 2MB
    },
    storage: storage,
}).single('file') // field name "body.file"
// >==== config  ====


const getAccount = async (req, res) => {
    try {
        const accountAddress = req.query.account_address.toLowerCase()
        if (accountAddress.length < 42) return res.status(404)

        const accountExist = await Account.findById(accountAddress).exec()
        if (accountExist) return res.status(200).json(accountExist)

        const newAccount = await Account({ _id: accountAddress }).save()
        return res.status(201).json(newAccount)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

const updateAvatar = (req, res) => {
    try {
        uploadSingle(req, res, async (_err) => {
            const accountAddress = req.body.account_address.toLowerCase()
            const thumbnailPath = AVATAR_PATH + accountAddress + '/thumb' + path.extname(req.file.filename)
            const thumbnailPathDb = AVATAR_PATH_DB + accountAddress + '/thumb' + path.extname(req.file.filename)
            const picturePathDb = `${path.dirname(req.file.path.substring(7))}/${req.file.filename}`

            await sharp(req.file.path).resize(360, 360, { fit: sharp.fit.cover }).toFile(thumbnailPath)
            await Account
                .findByIdAndUpdate(
                    accountAddress,
                    {
                        picture: picturePathDb,
                        thumbnail: thumbnailPathDb,
                    }
                )
                .exec()
            return res.status(200).json(thumbnailPathDb)
        })
    } catch (err) {
        console.error(err)
        return res.status(415).json({ error: 'Account: An unknown error occurred when uploading.' })
    }
}

const updateName = async (req, res) => {
    try {
        const accountAddress = req.body.account_address.toLowerCase()
        await Account.findByIdAndUpdate(
            accountAddress, { name: req.body.name }
        ).exec()
        return res.status(200).json(req.body.name)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

const updateBio = async (req, res) => {
    try {
        const accountAddress = req.body.account_address.toLowerCase()
        await Account.findByIdAndUpdate(
            accountAddress, { bio: req.body.bio }
        ).exec()
        return res.status(200).json(req.body.bio)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

const updateExternalUrl = async (req, res) => {
    try {
        const accountAddress = req.body.account_address.toLowerCase()
        await Account.findByIdAndUpdate(
            accountAddress,
            { external_url: req.body.external_url }
        ).exec()
        return res.status(200).json(req.body.external_url)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

const updateState = (account_address, state) => {
    try {
        const accountAddress = account_address.toLowerCase()
        Account.findByIdAndUpdate(
            accountAddress, { status: state }
        ).exec()
    } catch (error) {
        console.error(error)
    }
}

const updateStateMulti = (setOfAddress, state) => {
    try {
        let setOfAddressId = []
        setOfAddress.forEach(address => {
            setOfAddressId.push(address.toLowerCase())
        });
        Account.updateMany(
            setOfAddressId, { status: state }
        ).exec()
    } catch (error) {
        console.error(error)
    }
}

const addRole = (account_address, role) => {
    try {
        const accountAddress = account_address.toLowerCase()
        Account.findByIdAndUpdate(
            accountAddress,
            { $addToSet: { roles: role } },
            { upsert: true }
        ).exec()
    } catch (error) {
        console.error(error)
    }
}

const removeRole = (account_address, role) => {
    try {
        const accountAddress = account_address.toLowerCase()
        Account.findByIdAndUpdate(
            accountAddress,
            { $pull: { roles: role } },
        ).exec()
    } catch (error) {
        console.error(error)
    }
}

const create = (_req, res) => {
    try {
        const wallet = Wallet.createRandom()
        Account({ _id: wallet.address.toLowerCase() }).save()
        res.status(201).json({
            'address': wallet.address,
            'mnemonic': wallet.mnemonic.phrase,
            'privateKey': wallet.privateKey
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

module.exports = {
    create,
    updateState,
    updateStateMulti,
    addRole,
    removeRole,
    getAccount,
    updateAvatar,
    updateName,
    updateBio,
    updateExternalUrl,
}