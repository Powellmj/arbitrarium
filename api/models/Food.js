const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  name: {
    type: String,
  },
  notes: {
    type: String,
  },
  expiration: {
    type: String,
  },
  quantity: {
    type: String,
  },
  unit: {
    type: String,
  },
  created_at:
  {
    type: Date, default: Date.now
  }
});

module.exports = Food = mongoose.model('Food', FoodSchema);