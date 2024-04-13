const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  hostname: {
    type: String,
    unique: true,
    dropDups: true,
    default: ''
  },
  ip_address: {
    type: String,
    unique: true,
    dropDups: true,
    default: ''
  },
  mac_address: {
    type: String,
    unique: true,
    dropDups: true,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  created_at:
  {
    type: Date, default: Date.now
  }
});

module.exports = Contact = mongoose.model('Contact', ContactSchema);