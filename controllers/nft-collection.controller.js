const { COLLECTION_PATH, COLLECTION_PATH_DB } = require('../configs/constants')
const { NftCollection, Item } = require('../models')
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
            const collection_address = req.body.collection_address.toLowerCase()
            const thumbnailPath = COLLECTION_PATH + collection_address + '/thumbnail' + path.extname(req.file.filename)
            const thumbnailPathDb = COLLECTION_PATH_DB + collection_address + '/thumbnail' + path.extname(req.file.filename)
            await sharp(req.file.path).resize(360, 360, { fit: sharp.fit.cover }).toFile(thumbnailPath)

            const newCollection = new NftCollection({
                _id: collection_address,
                creator: req.body.creator_address.toLowerCase(),
                name: req.body.name,
                symbol: req.body.symbol,
                description: req.body.description,
                external_url: req.body.external_url,
                thumbnail: thumbnailPathDb,
                picture: req.file.path,
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

const updateCollectionThumbnail = (req, res) => {
    upload(req, res, async _err => {
        try {
            const from_collection_address = req.body.from_collection_address.toLowerCase()
            const thumbnailPath = COLLECTION_PATH + path.basename(req.file.path, path.extname(req.file.filename)) + '/thumbnail' + path.extname(req.file.filename)
            const thumbnailPathDb = COLLECTION_PATH_DB + path.basename(req.file.path, path.extname(req.file.filename)) + '/thumbnail' + path.extname(req.file.filename)
            await sharp(req.file.path).resize(360, 360, { fit: sharp.fit.cover }).toFile(thumbnailPath)
            await NftCollection
                .findByIdAndUpdate(
                    from_collection_address,
                    { thumbnail: thumbnailPathDb, picture: req.file.path }
                )
                .exec()
            return res.status(200).json(req.file.path)
        } catch (err) {
            console.error(err)
            return res.status(415).json({ error: 'Collection: An unknown error occurred when uploading.' })
        }
    })
}

const getAllCollectionOfAccount = async (req, res) => {
    try {
        const accountAddress = req.query.account_address.toLowerCase()
        const from_collections = await NftCollection.find({ creator: accountAddress }).sort('-createdAt').exec()
        return res.status(200).json(from_collections)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

const getAllItemOfCollection = async (req, res) => {
    try {
        const from_collection_address = req.query.from_collection_address.toLowerCase()
        const items = await Item
            .find({ from_collection: from_collection_address })
            .where({ is_show: true })
            .select({
                name: 1,
                thumbnail: 1,
                from_collection: 1,
            })
            .populate('owner', 'name thumbnail')
            .populate({
                path: 'from_collection',
                select: 'name thumbnail',
                populate: [
                    {
                        path: 'creator',
                        select: 'name thumbnail'
                    }
                ]
            })
            .sort('-_id')
            .exec()
        return res.status(200).json(items)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

const updateTotalSupply = (from_collection_address, totalSupply) => {
    try {
        NftCollection.findByIdAndUpdate(
            from_collection_address.toLowerCase(),
            { total_supply: totalSupply }
        ).exec()
    } catch (error) {
        console.error(error)
    }
}

const createCollectionForAccount = (
    from_collection_address,
    creator_address,
    from_collection_name,
    from_collection_symbol,
) => {
    try {
        NftCollection.findByIdAndUpdate(
            from_collection_address.toLowerCase(),
            {
                creator: creator_address.toLowerCase(),
                name: from_collection_name,
                symbol: from_collection_symbol,
            },
            { upsert: true }
        ).exec()
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createCollection,
    createCollectionForAccount,
    getAllCollectionOfAccount,
    getAllItemOfCollection,
    updateCollectionThumbnail,
    updateTotalSupply,

}