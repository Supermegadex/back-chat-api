const User = require('../schemas/user.schema');
const serverController = require('./server')(false);
const getUser = require('../auth/auth').getUser;

module.exports = async ({ code, token }) => {
  try {
    const { user, status } = await getUser({ token });
    if (status !== 1) return { status };
    const server = await serverController({ code });
    if (server) {
      user._serverIn = server.id;
      await user.save();
      return {
        status: 1,
        server
      }
    }
  }
  catch (err) {
    console.log(err);
    return {
      status: 5
    }
  }
}
