const { Schema, model } = require("mongoose")

const listingSchema = new Schema({
  _id: {
    type: String,
    minlength: 44,
    required: true,
    // default: '0x000000000000000000000000000000000000000000_0',
  },
  item: {
    type: String,
    required: true,
    ref: 'Item'
  },
  token_payment: {
    type: String,
    length: 42,
    required: true,
  },
  seller: {
    type: String,
    required: true,
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
  state: {
    type: String,
    enum: ['LISTING', 'SOLD', 'DELIVERED', 'CANCELED']
  },
}, { timestamps: true })

module.exports = model('Listing', listingSchema)
