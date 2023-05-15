const { Schema, model } = require("mongoose")
const { COLLECTION_PATH_DB_DEFAULT } = require("../configs/constants")

const nftCollectionSchema = new Schema({
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
  description: {
    type: String,
    maxlength: 256,
  },
  external_url: {
    type: String,
    maxlength: 128,
  },
  picture: {
    type: String,
    default: COLLECTION_PATH_DB_DEFAULT
  },
  thumbnail: {
    type: String,
    default: COLLECTION_PATH_DB_DEFAULT
  },
  creator: {
    type: String,
    length: 42,
    required: true,
    ref: 'Account'
  },
  collected_by: [{
    type: String,
    length: 42,
    required: true,
    ref: 'Account'
  }]
}, { timestamps: true })

module.exports = model('NftCollection', nftCollectionSchema)
