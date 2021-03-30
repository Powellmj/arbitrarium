const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
  },
  notes: {
    type: String,
  },
  quantity: {
    type: String,
  },
  unit: {
    type: String,
  },
  visible: {
    type: Boolean, default: true
  },
  expiration: {
    type: String,
  },
  expiration_date: {
    type: Date,
  },
  created_at:
  {
    type: Date, default: Date.now
  }
});

module.exports = Item = mongoose.model('Item', ItemSchema);