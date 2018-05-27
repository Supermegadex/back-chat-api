const mongoose = require('mongoose');

const channel = mongoose.Schema({
  name: String,
  _belongsTo: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Channel', channel);
