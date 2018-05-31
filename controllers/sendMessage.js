const Message = require('../schemas/message.schema');
const Channel = require('../schemas/channel.schema');
const auth = require('../auth/auth');
const pubsub = require('../pubsub/pubsub');

module.exports = async ({ token, channel, text }) => {
  try {
    const { user, status } = await auth.getUser({ token });
    if (status !== 1) return { status };
    if (!user._serverIn) return { status: 6 };
    const channelData = await checkChannel(channel);
    if (!channelData[0]) return { status: 7 };
    const message = new Message({
      text,
      _belongsTo: channel,
      author: user._id
    });
    await message.save();

    const author = require('./user')(false, user._id);
    pubsub.sendMessage({
      id: message._id,
      text: message.text,
      author: await author(),
      channel,
      server: channelData[1]._belongsTo
    });
    return {
      status: 1,
      message: {
        id: message._id,
        text: message.text,
        author
      }
    }
  }
  catch (err) {
    console.log(err);
    return { status: 5 };
  }
};

async function checkChannel(id) {
  const channels = await Channel.find({ _id: id });
  return [channels.length === 1, channels[0]];
}
