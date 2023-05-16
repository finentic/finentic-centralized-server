const { COLLECTION_PATH, COLLECTION_PATH_DB, COLLECTION_STATE } = require('../configs/constants')
const { NftCollection } = require('../models')
const fs = require('fs')
const path = require('path') // path for cut the file extension
const multer = require('multer')
const sharp = require('sharp')

// ==== config  ====<
sharp.cache(false)

const storage = multer.diskStorage({
    destination: (req, _file, callBack) => {
        const dir = COLLECTION_PATH + req.body.collection_address.toLowerCase()
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        callBack(null, dir)
    },
    filename: (_req, file, callBack) => {
        // Overwriting the previous picture
        const fileName = 'picture' + path.extname(file.originalname)
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
            return callBack(new Error('NftCollection: Only .png, .jpg and .jpeg format allowed!'))
        }
    },
    limits: {
        fileSize: (8 * 1024 * 1024) * 2, // 2MB
    }
}).single('file') // field name "body.file"
// >==== config  ====

const createCollection = (req, res) => {
    upload(req, res, async _err => {
        try {
            console.log("file", req.file)
            const collectionAddress = req.body.collection_address.toLowerCase()
            const thumbnailPath = COLLECTION_PATH + collectionAddress + '/thumbnail' + path.extname(req.file.filename)
            const thumbnailPathDb = COLLECTION_PATH_DB + collectionAddress + '/thumbnail' + path.extname(req.file.filename)
            const picturePathDb = `${path.dirname(req.file.path.substring(7))}/${req.file.filename}`

            await sharp(req.file.path).resize(360, 360, { fit: sharp.fit.cover }).toFile(thumbnailPath)
            const newCollection = new NftCollection({
                _id: collectionAddress,
                creator: req.body.creator_address.toLowerCase(),
                name: req.body.name,
                symbol: req.body.symbol,
                description: req.body.description,
                external_url: req.body.external_url,
                thumbnail: thumbnailPathDb,
                picture: picturePathDb,
            })

            await NftCollection.findByIdAndUpdate(newCollection._id, newCollection, { upsert: true }).exec()
            const new_collection = await NftCollection.findById(newCollection._id).exec()
            return res.status(200).json(new_collection)
        } catch (err) {
            console.error(err)
            return res.status(415).json({ error: 'Collection: An unknown error occurred when uploading.' })
        }
    })
}

const updateCollectionPicture = (req, res) => {
    upload(req, res, async _err => {
        try {
            const collectionAddress = req.body.collection_address.toLowerCase()
            const thumbnailPath = COLLECTION_PATH + collectionAddress + '/thumbnail' + path.extname(req.file.filename)
            const thumbnailPathDb = COLLECTION_PATH_DB + collectionAddress + '/thumbnail' + path.extname(req.file.filename)
            const picturePathDb = `${path.dirname(req.file.path.substring(7))}/${req.file.filename}`
            console.log(thumbnailPathDb)

            await sharp(req.file.path).resize(360, 360, { fit: sharp.fit.cover }).toFile(thumbnailPath)
            await NftCollection
                .findByIdAndUpdate(
                    collectionAddress,
                    { thumbnail: thumbnailPathDb, picture: picturePathDb }
                )
                .exec()
            return res.status(200).json(thumbnailPathDb)
        } catch (err) {
            console.error(err)
            return res.status(415).json({ error: 'Collection: An unknown error occurred when uploading.' })
        }
    })
}

const updateCollectionDescription = async (req, res) => {
    try {
        const collectionAddress = req.body.collection_address.toLowerCase()
        await NftCollection.findByIdAndUpdate(
            collectionAddress,
            { description: req.body.description }
        ).exec()
        return res.status(200).end()
    } catch (err) {
        console.error(err)
        return res.status(415).json({ error: 'Collection: An unknown error occurred when uploading.' })
    }
}

const getCollectionById = async (req, res) => {
    try {
        const collectionAddress = req.query.collection_address.toLowerCase()
        if (collectionAddress.length < 42) return res.status(404).end()

        const collectionExist = await NftCollection
            .findById(collectionAddress)
            .where({ state: { $ne: COLLECTION_STATE.HIDDEN } })
            .populate({
                path: 'creator',
                select: 'name thumbnail status',
            })
            .sort('-createdAt')
            .exec()
        if (collectionExist) return res.status(200).json(collectionExist)

        return res.status(404).end()
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

const getAllCollections = async (req, res) => {
    try {
        const collectionExist = await NftCollection
            .find({ state: { $ne: COLLECTION_STATE.HIDDEN } })
            .populate({
                path: 'creator',
                select: 'name thumbnail status',
            })
            .sort('-createdAt')
            .exec()
        if (collectionExist) return res.status(200).json(collectionExist)
        return res.status(200).json([])
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

const getAllCollectionOfAccount = async (req, res) => {
    try {
        const accountAddress = req.query.account_address.toLowerCase()
        const collectionExists = await NftCollection
            .find({ creator: accountAddress, state: { $ne: COLLECTION_STATE.HIDDEN } })
            .select({
                name: 1,
                symbol: 1,
                thumbnail: 1,
            })
            .populate({
                path: 'creator',
                select: 'name thumbnail status',
            })
            .sort('-createdAt')
            .exec()
        if (collectionExists.length) return res.status(200).json(collectionExists)
        return res.status(200).json([])
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

const createCollectionForAccount = async (
    from_collection_address,
    creator_address,
    from_collection_name,
    from_collection_symbol,
) => {
    await NftCollection.findByIdAndUpdate(
        from_collection_address.toLowerCase(),
        {
            creator: creator_address.toLowerCase(),
            name: from_collection_name,
            symbol: from_collection_symbol,
            state: COLLECTION_STATE.CREATED
        },
        { upsert: true }
    ).exec()
}

module.exports = {
    getCollectionById,
    createCollection,
    createCollectionForAccount,
    getAllCollectionOfAccount,
    updateCollectionPicture,
    updateCollectionDescription,
    getAllCollections,
}