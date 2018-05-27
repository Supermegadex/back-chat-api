const mongoose = require('mongoose');

const message = mongoose.Schema({
  _belongsTo: mongoose.Schema.Types.ObjectId,
  text: String,
  author: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Message', message);
