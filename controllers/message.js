const Message = require('../schemas/message.schema');

const testMessage = {
  text: 'Hello, world!',
  author: require('./user')(false)
};

module.exports = (multiple, channel) => {
  if (multiple) return async () => {
    if (channel) {
      const messages = await Message.find({ _belongsTo: channel });
      return messages.map(message => ({
        text: message.text,
        author: require('./user')(false, { _id: message.author })
      }));
    }
  };
  else return async () => {
    if (channel) {
      const messages = await Message.find({ _belongsTo: channel });
      return messages
    }
  };
}
