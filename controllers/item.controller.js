const fs = require('fs')
const { dirname, extname, basename } = require('path') // path for cut the file extension
const multer = require('multer')
const sharp = require('sharp')
const { Item } = require('../models')
const { solidityKeccak256 } = require('ethers/lib/utils')
const { ITEM_PATH, ITEM_PATH_RAW, ITEM_STATE } = require('../configs/constants')
const toItemId = (from_collection_address, token_id) => `${from_collection_address.toLowerCase()}_${token_id}`

sharp.cache(false)

const storage = multer.diskStorage({
    destination: (req, _file, callBack) => {
        const { from_collection_address, token_id } = req.body
        const itemId = toItemId(from_collection_address, token_id)
        const dir = ITEM_PATH + itemId
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        callBack(null, dir)
    },
    filename: (_req, file, callBack) => {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9) + extname(file.originalname)
        callBack(null, uniqueSuffix)
    }
})

const uploadMulti = multer({
    // The function should call `callBack` with a boolean to indicate if the file should be accepted
    fileFilter: (_req, file, callBack) => {
        if (
            file.mimetype == "image/png"
            || file.mimetype == "image/jpg"
            || file.mimetype == "image/jpeg"
        ) {
            callBack(null, true)
        } else {
            console.error('Item: Only .png, .jpg and .jpeg format allowed!')
            callBack(null, false)
        }
    },
    storage: storage,
    limits: {
        fileSize: (8 * 1024 * 1024) * 10, // max 10MB
    }
}).array('files', 10) // max 100MB

const uploadSingle = multer({
    // The function should call `callBack` with a boolean to indicate if the file should be accepted
    fileFilter: (_req, file, callBack) => {
        if (
            file.mimetype == "image/png"
            || file.mimetype == "image/jpg"
            || file.mimetype == "image/jpeg"
        ) {
            callBack(null, true)
        } else {
            console.error('Item: Only .png, .jpg and .jpeg format allowed!')
            callBack(null, false)
        }
    },
    storage: storage,
    limits: {
        fileSize: (8 * 1024 * 1024) * 10, // max 10MB
    }
}).single('file') // max 10MB

const getAllItemsOfAccount = async (req, res) => {
    try {
        const accountAddress = req.query.account_address.toLowerCase()
        const items = await Item
            .find({ owner: accountAddress })
            .select({
                name: 1,
                thumbnail: 1,
                from_collection: 1,
            })
            .populate('from_collection', 'name')
            .sort('-updatedAt')
            .exec()
        return res.status(200).json(items)
    } catch (error) {
        return res.status(404).json(error)
    }
}

const getItemById = async (req, res) => {
    try {
        const itemId = req.query.item_id.toLowerCase()
        const item = await Item
            .findById(itemId)
            .populate('owner', 'name thumbnail status')
            .populate({
                path: 'from_collection',
                select: 'name thumbnail',
            })
            .populate({
                path: 'creator',
                select: 'name thumbnail bio status',
            })
            .populate({
                path: 'ownership_history',
                populate: {
                    path: 'account',
                    select: 'name thumbnail status'
                }
            })
            .populate({
                path: 'price_history',
                populate: {
                    path: 'account',
                    select: 'name thumbnail status'
                }
            })
            .exec()
        return res.status(200).json(item)
    } catch (error) {
        return res.status(404).json(error)
    }
}

const getItemByIdForUpdate = async (req, res) => {
    try {
        const itemId = req.params.item_id.toLowerCase()
        const item = await Item
            .findById(itemId)
            .select({
                name: 1,
                thumbnail: 1,
                from_collection: 1,
                description: 1,
                external_url: 1,
                owner: 1,
            })
            .populate('owner', 'name thumbnail status')
            .exec()
        return res.status(200).json(item)
    } catch (error) {
        return res.status(404).json(error)
    }
}

const updateItemById = async (req, res) => {
    try {
        const itemId = req.body.item_id.toLowerCase()
        await Item.findByIdAndUpdate(
            itemId,
            {
                description: req.body.description,
                external_url: req.body.external_url,
            }
        ).exec()
        return res.status(200).end()
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

const searchItem = async (req, res) => {
    try {
        const { keywords } = req.query
        const keywordsLength = keywords.trim().length
        if (keywordsLength == 0) return res.status(200).json([])

        const items = (keywordsLength > 42 && keywords.substring(0, 2) == "0x") // address length
            ? await searchItemById(keywords)
            : await searchItemByName(keywords)
        return res.status(200).json(items)
    } catch (error) {
        return res.status(404).json(error)
    }
}


const getItems = async (req, res) => {
    try {
        const items = await searchItemByName('')
        return res.status(200).json(items)
    } catch (error) {
        console.error(error)
        return res.status(404).json(error)
    }
}

const searchItemByName = (keywords) => Item
    .find(({ name: { $regex: keywords, $options: 'i' }, state: { $ne: ITEM_STATE.HIDDEN } }))
    .select({
        name: 1,
        thumbnail: 1,
        from_collection: 1,
        is_phygital: 1,
        state: 1,
        owner: 1,
        price: 1,
    })
    .populate('owner', 'name thumbnail status')
    .populate({
        path: 'from_collection',
        select: 'name thumbnail',
        populate: {
            path: 'creator',
            select: 'name thumbnail status'
        }
    })
    .sort('-createdAt')
    .exec()

const searchItemById = (itemId) => Item
    .find({ _id: itemId })
    .select({
        name: 1,
        thumbnail: 1,
        from_collection: 1,
        is_phygital: 1,
        state: 1,
        owner: 1,
    })
    .populate('owner', 'name thumbnail status')
    .populate({
        path: 'from_collection',
        select: 'name thumbnail',
        populate: {
            path: 'creator',
            select: 'name thumbnail status'
        }
    })
    .sort('-createdAt')
    .exec()

const getRawMetadataById = async (itemId) => {
    const itemMetadata = await Item
        .findById(itemId)
        .select({
            _id: 0,
            name: 1,
            from_collection: 1,
            token_id: 1,
            is_phygital: 1,
            properties: 1,
            pictures: {
                raw_base64_hashed: 1,
            },
        })
        .exec()

    // remove object _id
    const pictures = itemMetadata.pictures.map(picture => picture.raw_base64_hashed)
    const properties = itemMetadata.properties.map(property => new Object({
        name: property.name,
        value: property.value,
    }))

    // merge with original object
    const convertItemMetadata = {
        ...itemMetadata._doc, // mongoose document
        ...{ pictures },
        ...{ properties },
    }

    return convertItemMetadata
}

const getRawMetadata = async (req, res) => {
    try {
        const itemId = req.params.item_id.toLowerCase()
        const rawMetadata = await getRawMetadataById(itemId)
        return res.status(200).send(rawMetadata)
    } catch (error) {
        return res.status(404).json(error)
    }
}

const createItem = async (req, res) => {
    uploadMulti(req, res, async (_err) => {
        try {
            const pictures = []
            const properties = []
            const { path, filename } = req.files[0]

            req.body._id = toItemId(req.body.from_collection_address, req.body.token_id)
            req.body.owner = req.body.owner_address.toLowerCase()
            req.body.creator = req.body.owner_address.toLowerCase()
            req.body.from_collection = req.body.from_collection_address.toLowerCase()

            const thumbnailPath = `${dirname(path)}/${basename(path, extname(filename))}_thumb${extname(filename)}`
            const thumbnailPathDb = `${dirname(path.substring(7))}/${basename(path, extname(filename))}_thumb${extname(filename)}`
            await sharp(path)
                .resize(undefined, 250, { fit: sharp.fit.cover })
                .toFile(thumbnailPath)

            req.files.forEach(async element => {
                // convert binary data to base64 encoded string
                const base64EncodePicture = fs.readFileSync(element.path, 'base64')
                const raw_base64_hashed = solidityKeccak256(['string'], [base64EncodePicture])
                pictures.push({
                    file_uri: `${dirname(element.path.substring(7))}/${element.filename}`,
                    raw_base64_uri: `${ITEM_PATH_RAW}${dirname(element.path.substring(22))}/${element.filename}`,
                    raw_base64_hashed: raw_base64_hashed,
                })
            })

            for (const rawProperty of req.body.properties) {
                const property = JSON.parse(rawProperty)
                if (property.name) properties.push(property)
            }
            req.body.properties = properties.length ? properties : undefined
            req.body.pictures = pictures
            req.body.thumbnail = thumbnailPathDb

            const newItem = new Item(req.body)
            await Item.findByIdAndUpdate(newItem._id, newItem, { upsert: true }).exec()

            const metadata = await getRawMetadataById(newItem._id)
            const hashedMetadata = solidityKeccak256(['string'], [JSON.stringify(metadata)])
            await Item.findByIdAndUpdate(newItem._id, { hashed_metadata: hashedMetadata }).exec()
            return res.status(201).json({ hashed_metadata: hashedMetadata })
        } catch (error) {
            console.error(error)
            res.status(415).json({ error: 'Item: An unknown error occurred when uploading.' })
        }
    })
}

const getPictureInBase64Encode = async (req, res) => {
    try {
        const itemId = req.params.item_id
        const fileName = req.params.file_name
        const itemPath = `${ITEM_PATH}${itemId}/${fileName}`
        // convert binary data to base64 encoded string
        const base64EncodePicture = fs.readFileSync(itemPath, 'base64')
        return res.status(200).send(base64EncodePicture)
    } catch (error) {
        return res.status(404).json(error)
    }
}

const updateOwnerAndState = async (
    from_collection_address,
    token_id,
    owner,
    item_state,
    tx_hash,
    timestamp,
) => {
    const itemId = toItemId(from_collection_address, token_id)
    console.info('UpdateOwnerAndState: ', itemId)
    await Item.findByIdAndUpdate(
        itemId,
        {
            $addToSet: {
                ownership_history: {
                    account: owner,
                    tx_hash,
                    timestamp,
                },
            },
            owner,
            state: item_state
        },
        { upsert: true }
    ).exec()
}

const updateState = async (from_collection_address, token_id, item_state) => {
    const itemId = toItemId(from_collection_address, token_id)
    await Item.findByIdAndUpdate(itemId, { state: item_state }).exec()
}

const listForAuction = (
    from_collection_address,
    token_id,
    start_time,
    end_time,
    payment_token,
    amount,
    gap,
) => {
    const itemId = toItemId(from_collection_address, token_id)
    console.info('ListForAuction: ', itemId)
    Item.findByIdAndUpdate(
        itemId,
        {
            start_time,
            end_time,
            price: amount,
            gap,
            payment_token,
            state: ITEM_STATE.LISTING,
        },
    ).exec()
}

const biddingForAuction = (
    from_collection_address,
    token_id,
    bidder,
    amount,
    tx_hash,
    timestamp,
) => {
    const itemId = toItemId(from_collection_address, token_id)
    console.info('BiddingForAuction: ', itemId)
    Item.findByIdAndUpdate(
        itemId,
        {
            $addToSet: {
                price_history: {
                    account: bidder,
                    amount,
                    tx_hash,
                    timestamp,
                },
            },
            buyer: bidder,
            price: amount,
        },
    ).exec()
}

const listForBuyNow = (
    from_collection_address,
    token_id,
    payment_token,
    price,
) => {
    const itemId = toItemId(from_collection_address, token_id)
    Item.findByIdAndUpdate(
        itemId,
        {
            price,
            payment_token,
            state: ITEM_STATE.LISTING
        },
    ).exec()
}

const phygitalItemUpdate = (
    from_collection_address,
    token_id,
    phygital_item_state,
    next_update_deadline,
) => {
    const itemId = toItemId(from_collection_address, token_id)
    console.info('PhygitalItemUpdate: ', itemId)
    Item.findByIdAndUpdate(
        itemId,
        {
            state: phygital_item_state,
            next_update_deadline,
        },
    ).exec()
}

const removeItemListed = (
    from_collection_address,
    token_id,
    state,
) => {
    const itemId = toItemId(from_collection_address, token_id)
    console.info('RemoveItemListed: ', itemId)
    Item.findByIdAndUpdate(
        itemId,
        {
            $unset: {
                price: 1,
                payment_token: 1,
                next_update_deadline: 1,
                delivery: 1,
                gap: 1,
                end_time: 1,
                start_time: 1,
                buyer: 1,
            },
            state: state,
        },
    ).exec()
}

module.exports = {
    getItems,
    getAllItemsOfAccount,
    getRawMetadata,
    getItemById,
    getPictureInBase64Encode,
    createItem,
    searchItem,
    updateOwnerAndState,
    updateState,
    listForAuction,
    biddingForAuction,
    listForBuyNow,
    phygitalItemUpdate,
    removeItemListed,
    updateItemById,
    getItemByIdForUpdate,
}