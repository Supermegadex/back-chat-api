const mongoose = require('mongoose');

const server = mongoose.Schema({
  name: String,
  code: String
});

module.exports = mongoose.model('Server', server);
