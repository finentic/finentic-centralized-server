const { Schema, model } = require("mongoose")
const { ITEM_PATH_DB_DEFAULT } = require("../configs/constants")

const itemSchema = new Schema({
  _id: {
    type: String,
    minlength: 44,
    required: true,
    // default: '0x000000000000000000000000000000000000000000_0',
  },
  name: {
    type: String,
    required: true,
    maxlength: 32,
  },
  is_phygital: {
    type: Boolean,
    default: false,
  },
  thumbnail: {
    type: String,
    default: ITEM_PATH_DB_DEFAULT
  },
  pictures: [{
    file_uri: {
      type: String,
      default: defaultPicture,
    },
    raw_base64_uri: {
      type: String,
    },
    raw_base64_hashed: {
      type: String,
      length: 66,
      required: true,
      // default: '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
  }],
  properties: [{
    name: {
      type: String,
      maxlength: 32,
      required: true,
    },
    value: {
      type: String,
      maxlength: 32,
      required: true,
    }
  }],
  hashedMetadata: {
    type: String,
    length: 66,
    required: true,
    // default: '0x0000000000000000000000000000000000000000000000000000000000000000',
  },
  description: {
    type: String,
    maxlength: 2048,
  },
  external_url: {
    type: String,
  },
  owner: {
    type: String,
    length: 42,
    required: true,
    ref: 'Account'
  },
  ownership_history: [{
    owner: {
      type: String,
      ref: 'Account'
    },
    timestamp: {
      type: String,
    }
  }],
  is_show: {
    type: Boolean,
  },
})

module.exports = model('Item', itemSchema)
