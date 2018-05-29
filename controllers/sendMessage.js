const Message = require('../schemas/message.schema');
const Channel = require('../schemas/channel.schema');
const auth = require('../auth/auth');

module.exports = async ({ token, channel, text }) => {
  try {
    const { user, status } = await auth.getUser({ token });
    if (status !== 1) return { status };
    if (!user._serverIn) return { status: 6 };
    if (!(await checkChannel(channel))) return { status: 7 };
    const message = new Message({
      text,
      _belongsTo: channel,
      author: user._id
    });
    await message.save();
    return {
      status: 1,
      message: {
        id: message._id,
        text: message.text,
        author: require('./user')(false, user._id)
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
  return channels.length === 1;
}
