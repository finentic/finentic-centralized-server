const { Schema, model } = require("mongoose")
const { AVATAR_PATH_DB_DEFAULT, ACCOUNT_STATE, ROLES } = require("../configs/constants")

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
  picture: {
    type: String,
    default: AVATAR_PATH_DB_DEFAULT,
  },
  thumbnail: {
    type: String,
    default: AVATAR_PATH_DB_DEFAULT,
  },
  roles: [{
    type: String,
    enum: ROLES
  }],
  status: {
    type: String,
    enum: ACCOUNT_STATE,
    default: ACCOUNT_STATE.UNVERIFIED,
  }
  // cover_photo: {
  //   type: String,
  //   default: DEFAULT_PICTURE_DB,
  // },
}, { timestamps: true })

module.exports = model("Account", accountSchema)
