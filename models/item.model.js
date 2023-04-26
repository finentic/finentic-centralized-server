const { Schema, model } = require("mongoose")
const { ITEM_PATH_DB_DEFAULT, LISTING_STATE } = require("../configs/constants")

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
    ref: 'Account'
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
  hashedMetadata: {
    type: String,
    length: 66,
    required: true,
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
      required: true,
      // default: '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    timestamp: {
      type: String,
    }
  }],
  is_show: {
    type: Boolean,
    default: false,
  },
  token_payment: {
    type: String,
    length: 42,
  },
  seller: {
    type: String,
    ref: 'Account'
  },
  auction: {
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    bidder: {
      type: String,
      ref: 'Account'
    },
    amount: {
      type: String,
    },
    gap: {
      type: String,
    },
    history: [{
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
        required: true,
        // default: '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
      timestamp: {
        type: String,
      }
    }]
  },
  price: {
    type: String,
  },
  buyer: {
    type: String,
    ref: 'Account'
  },
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
  status: {
    type: String,
    enum: LISTING_STATE,
  },
}, { timestamps: true })

module.exports = model('Item', itemSchema)
