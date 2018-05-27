const User = require('../schemas/user.schema');

const testUser = {
  name: "Daniel",
  email: "delpinothedragon1@hotmail.com"
};

module.exports = (multiple, { _id, server } = {}) => {
  if (multiple) return async () => {
    if (server) {
      const users = (await User.find({ _serverIn: server }));
      return users;
    }
  };
  else return async ({ id } = {}) => {
    if (_id) {
      const userId = id || _id;
      const user = (await User.find({ _id: userId }))[0];
      return user;
    }
  };
}