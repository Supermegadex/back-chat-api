const mongoose = require('mongoose');

const user = mongoose.Schema({
  name: String,
  email: String,
  _serverIn: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('User', user);
