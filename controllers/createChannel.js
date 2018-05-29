const Channel = require('../schemas/channel.schema');
const auth = require('../auth/auth');

module.exports = async ({ token, name }) => {
  try {
    const { user, status } = await auth.getUser({ token });
    if (status !== 1) return { status };
    if (!user._serverIn) return { status: 6 };
    const channel = new Channel({
      name: name,
      _belongsTo: user._serverIn
    });
    await channel.save();
    return {
      status: 1,
      channel: {
        id: channel._id,
        name: channel.name,
        messages: require('./message')(true, channel._id)
      }
    }
  }
  catch (err) {
    console.log(err);
    return { status: 5 };
  }
}
