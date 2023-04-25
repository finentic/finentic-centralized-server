require("dotenv").config(() => {
    if (process.env.NODE_ENV === "production")
        return { path: '.env.production' }
    else if (process.env.NODE_ENV === "development")
        return { path: '.env.development' }
    else return
})

const {
    API_WS_ENDPOINT,
    API_HTTP_ENDPOINT,
    NETWORK_ID,
} = process.env

const AVATAR_PATH = 'public/pictures/avatars/'
const AVATAR_PATH_DB = 'pictures/avatars/'
const AVATAR_PATH_DB_DEFAULT = 'pictures/avatars/default.jpg'

const ITEM_PATH = 'public/pictures/items/'
const ITEM_PATH_RAW = '/picture/raw/'
const ITEM_PATH_DB_DEFAULT = 'pictures/items/default.jpg'

const DEFAULT_PICTURE = 'public/pictures/default.jpg'
const DEFAULT_PICTURE_DB = 'pictures/default.jpg'

module.exports = {
    AVATAR_PATH,
    AVATAR_PATH_DB,
    AVATAR_PATH_DB_DEFAULT,
    ITEM_PATH,
    ITEM_PATH_RAW,
    DEFAULT_PICTURE,
    DEFAULT_PICTURE_DB,
    ITEM_PATH_DB_DEFAULT,
    API_WS_ENDPOINT,
    API_HTTP_ENDPOINT,
    NETWORK_ID,
}