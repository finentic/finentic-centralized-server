const { AVATAR_PATH, AVATAR_PATH_DB } = require('../configs/constants')
const { Account } = require('../models')
const path = require('path') // path for cut the file extension
const multer = require('multer')
const sharp = require('sharp')

// ==== config  ====<
sharp.cache(false)

const storage = multer.diskStorage({
    destination: (_req, _file, callBack) => {
        callBack(null, AVATAR_PATH)
    },
    filename: (req, file, callBack) => {
        // Overwriting the previous avatar
        const fileName = req.body.address.toLowerCase() + path.extname(file.originalname)
        callBack(null, fileName)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (_req, file, callBack) => {
        if (
            file.mimetype == "image/png"
            || file.mimetype == "image/jpg"
            || file.mimetype == "image/jpeg"
        ) callBack(null, true)
        else {
            callBack(null, false)
            return callBack(new Error('Only .png, .jpg and .jpeg format allowed!'))
        }
    },
    limits: {
        fileSize: (8 * 1024 * 1024) * 2, // 2MB
    }
}).single('file') // field name "body.file"
// >==== config  ====


const getAccount = async (req, res) => {
    try {
        const accountAddress = req.query.address.toLowerCase()
        const accountExist = await Account.findById(accountAddress).exec()
        if (accountExist) return res.status(200).json(accountExist)
        else {
            const newAccount = await Account({ _id: accountAddress }).save()
            return res.status(201).json(newAccount)
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }

}

const updateAvatar = (req, res) => {
    upload(req, res, async _err => {
        try {
            const accountAddress = req.body.address.toLowerCase()
            const thumbnailPath = AVATAR_PATH + path.basename(req.file.path, path.extname(req.file.filename)) + '_thumb' + path.extname(req.file.filename)
            const thumbnailPathDb = AVATAR_PATH_DB + path.basename(req.file.path, path.extname(req.file.filename)) + '_thumb' + path.extname(req.file.filename)
            await sharp(req.file.path).resize(360, 360, { fit: sharp.fit.cover }).toFile(thumbnailPath)
            await Account
                .findByIdAndUpdate(
                    accountAddress,
                    { avatar: req.file.path, avatar_thumb: thumbnailPathDb }
                )
                .exec()
            return res.status(200).json(req.file.path)
        } catch (err) {
            console.error(err)
            return res.status(415).json({ error: 'An unknown error occurred when uploading.' })
        }
    })
}

const updateName = async (req, res) => {
    try {
        const accountAddress = req.body.address.toLowerCase()
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
        const accountAddress = req.body.address.toLowerCase()
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
        const accountAddress = req.body.address.toLowerCase()
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

const updateState = (address, state) => {
    try {
        const accountAddress = address.toLowerCase()
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

const addRole = (address, role) => {
    try {
        const accountAddress = address.toLowerCase()
        Account.findByIdAndUpdate(
            accountAddress,
            { $addToSet: { roles: role } },
            { upsert: true }
        ).exec()
    } catch (error) {
        console.error(error)
    }
}

const removeRole = (address, role) => {
    try {
        const accountAddress = address.toLowerCase()
        Account.findByIdAndUpdate(
            accountAddress,
            { $pull: { roles: role } },
        ).exec()
    } catch (error) {
        console.error(error)
    }
}

// const create = async (_req, res) => {
//     try {
//         const wallet = await new ethers.Wallet.createRandom()
//         res.status(201).json({
//             'address': wallet.address,
//             'mnemonic': wallet.mnemonic.phrase,
//             'privateKey': wallet.privateKey
//         })
//     } catch (error) {
//         console.error(error)
//         return res.status(500).json(error)
//     }
// }

module.exports = {
    // create,
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