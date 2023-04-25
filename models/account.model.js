const { Schema, model } = require("mongoose")
const { AVATAR_PATH_DB_DEFAULT } = require("../configs/constants")

const accountSchema = new Schema({
  _id: {
    type: String,
    length: 42,
    required: true,
  },
  name: {
    type: String,
    default: 'Unnamed',
    maxlength: 32,
  },
  bio: {
    type: String,
    maxlength: 512,
  },
  external_url: {
    type: String,
    maxlength: 64,
  },
  avatar: {
    type: String,
    default: AVATAR_PATH_DB_DEFAULT,
  },
  avatar_thumb: {
    type: String,
    default: AVATAR_PATH_DB_DEFAULT,
  },
  role: [{
    type: String,
    enum: [
      'DEFAULT_ADMIN',
      'MODERATOR_ADMIN',
      'MODERATOR',
      'TREASURER_ADMIN',
      'TREASURER',
      'OPERATOR_ADMIN',
      'OPERATOR',
    ]
  }],
  state: {
    type: String,
    enum: ['UNVERIFIED', "VERIFIED", "BANNED"]
  }
  // cover_photo: {
  //   type: String,
  //   default: DEFAULT_PICTURE_DB,
  // },
}, { timestamps: true })

module.exports = model("Account", accountSchema)
