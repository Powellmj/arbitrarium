const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  hostname: {
    type: String,
    default: ''
  },
  ip_address: {
    type: String,
    default: ''
  },
  mac_address: {
    type: String,
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