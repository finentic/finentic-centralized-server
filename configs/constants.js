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

const COLLECTION_PATH = 'public/pictures/collections/'
const COLLECTION_PATH_DB = 'pictures/collections/'
const COLLECTION_PATH_DB_DEFAULT = 'pictures/collections/default.jpg'

const DEFAULT_PICTURE = 'public/pictures/default.jpg'
const DEFAULT_PICTURE_DB = 'pictures/default.jpg'

const ACCOUNT_STATE = {
    UNVERIFIED: 'UNVERIFIED',
    VERIFIED: "VERIFIED",
    BANNED: "BANNED",
}

const ITEM_STATE = {
    CREATED: 'CREATED',
    LISTING: 'LISTING',
    SOLD: 'SOLD',
    DELIVERED: 'DELIVERED',
    CANCELED: 'CANCELED',
    HIDDEN: 'HIDDEN',
}

const COLLECTION_STATE = {
    CREATED: 'CREATED',
    HIDDEN: 'HIDDEN',
}

const ROLES = {
    DEFAULT_ADMIN: 'DEFAULT_ADMIN',
    MODERATOR_ADMIN: 'MODERATOR_ADMIN',
    MODERATOR: 'MODERATOR',
    TREASURER_ADMIN: 'TREASURER_ADMIN',
    TREASURER: 'TREASURER',
    OPERATOR_ADMIN: 'OPERATOR_ADMIN',
    OPERATOR: 'OPERATOR',
}

const ROLES_MAPPING = {
    '0x0000000000000000000000000000000000000000000000000000000000000000': ROLES.DEFAULT_ADMIN,
    '0x71f3d55856e4058ed06ee057d79ada615f65cdf5f9ee88181b914225088f834f': ROLES.MODERATOR,
    '0x3496e2e73c4d42b75d702e60d9e48102720b8691234415963a5a857b86425d07': ROLES.TREASURER,
    '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929': ROLES.OPERATOR,
}

const ADMIN_ROLES_MAPPING = {
    '0x0000000000000000000000000000000000000000000000000000000000000000': ROLES.DEFAULT_ADMIN,
    '0x71f3d55856e4058ed06ee057d79ada615f65cdf5f9ee88181b914225088f834f': ROLES.MODERATOR_ADMIN,
    '0x3496e2e73c4d42b75d702e60d9e48102720b8691234415963a5a857b86425d07': ROLES.TREASURER_ADMIN,
    '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929': ROLES.OPERATOR_ADMIN,
}

module.exports = {
    ACCOUNT_STATE,
    ITEM_STATE,
    COLLECTION_STATE,

    ROLES,
    ROLES_MAPPING,
    ADMIN_ROLES_MAPPING,

    AVATAR_PATH,
    AVATAR_PATH_DB,
    AVATAR_PATH_DB_DEFAULT,

    ITEM_PATH,
    ITEM_PATH_RAW,
    ITEM_PATH_DB_DEFAULT,

    COLLECTION_PATH,
    COLLECTION_PATH_DB,
    COLLECTION_PATH_DB_DEFAULT,

    DEFAULT_PICTURE,
    DEFAULT_PICTURE_DB,

    API_WS_ENDPOINT,
    API_HTTP_ENDPOINT,

    NETWORK_ID,
}