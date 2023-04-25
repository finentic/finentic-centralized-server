const { Schema, model } = require("mongoose")
const { ITEM_PATH_DB_DEFAULT } = require("../configs/constants")

const collectionSchema = new Schema({
  _id: {
    type: String,
    length: 42,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 32,
  },
  symbol: {
    type: String,
    required: true,
    maxlength: 32,
  },
  thumbnail: {
    type: String,
    default: ITEM_PATH_DB_DEFAULT
  },
  total_supply: {
    type: String,
    default: '0'
  },
  creator: {
    type: String,
    length: 42,
    required: true,
    ref: 'Account'
  },
}, { timestamps: true })

module.exports = model('Collection', collectionSchema)
