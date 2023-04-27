const { Schema, model } = require("mongoose")
const { ITEM_PATH_DB_DEFAULT, ITEM_STATE } = require("../configs/constants")

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
  from_collection: {
    type: String,
    required: true,
    ref: 'Collection'
  },
  pictures: [{
    file_uri: {
      type: String,
      default: ITEM_PATH_DB_DEFAULT,
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
  hashed_metadata: {
    type: String,
    length: 66,
    // default: '0x0000000000000000000000000000000000000000000000000000000000000000',
  },
  thumbnail: {
    type: String,
    default: ITEM_PATH_DB_DEFAULT
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
    required: true,
    ref: 'Account'
  },
  ownership_history: [{
    owner: {
      type: String,
      ref: 'Account'
    },
    tx_hash: {
      type: String,
      length: 66,
      // default: '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    timestamp: {
      type: String,
    }
  }],
  payment_token: {
    type: String,
    length: 42,
  },
  price: {
    type: String,
  },
  buyer: {
    type: String,
    ref: 'Account'
  },
  start_time: {
    type: String,
  },
  end_time: {
    type: String,
  },
  gap: {
    type: String,
  },
  auction_history: [{
    bidder: {
      type: String,
      ref: 'Account'
    },
    amount: {
      type: String,
    },
    tx_hash: {
      type: String,
      length: 66,
      // default: '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    timestamp: {
      type: String,
    }
  }],
  delivery: {
    from: {
      type: String,
      maxlength: 64,
    },
    to: {
      type: String,
      maxlength: 64,
    },
    now: {
      type: String,
      maxlength: 64,
    }
  },
  next_update_deadline: {
    type: String,
  },
  state: {
    type: String,
    enum: ITEM_STATE,
    default: ITEM_STATE[5],
  },
}, { timestamps: true })

module.exports = model('Item', itemSchema)
