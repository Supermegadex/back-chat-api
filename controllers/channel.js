const Channel = require('../schemas/channel.schema');
const mongoose = require('mongoose');

const testChannel = {
  name: "Test",
  messages: require('./message')(true)
};

module.exports = (multiple, server) => {
  if (multiple) return async ({ belongsTo } = {}) => {
    if (server || belongsTo) {
      const _belongsTo = server ? server : new mongoose.Types.ObjectId(belongsTo);
      const channels = await Channel.find({ _belongsTo });
      return channels.map(channel => ({
        id: channel._id,
        name: channel.name,
        messages: require('./message')(true, channel._id)
      }))
    }
  };
  else return async ({ id }) => {
    if (id) {
      const channel = (await Channel.find({ _id: id }))[0];
      return {
        id: channel._id,
        name: channel.name,
        messages: require('./message')(true, channel._id)
      };
    }
  };
}
