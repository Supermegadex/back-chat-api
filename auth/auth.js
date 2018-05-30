const User = require('../schemas/user.schema');
const jwt = require('jsonwebtoken');

module.exports = {
  login: async ({ name, email, token }) => {
    if (!token) {
      // Assume user doesn't exist
      try {
        const user = new User({ name, email });
        await user.save();
        const payload = {
          name, email, id: user._id
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'debug');
        return {
          status: 1,
          token
        }
      }
      catch (err) {
        console.log(err);
        return {
          status: 5
        }
      }
    }
  },
  verify: async ({ token } = {}) => {
    try {
      if (token) {
        const user = getUserByToken(token);
        if (user) {
          return 1; // Valid token with existing user
        }
        else return 2; // User does not exist
      }
      else {
        return 3; // Token not provided
      }
    }
    catch (err) {
      console.log(err);
      return 4; // Malformed token
    }
  },
  getUser: async ({ token } = {}) => {
    try {
      if (token) {
        const user = await getUserByToken(token);
        if (user) {
          return {
            status: 1,
            user,
            server: user._serverIn
          }; // Valid token with existing user
        }
        else return {
          status: 2 // User does not exist
        }
      }
      else {
        return {
          status: 3 // Token not provided
        }  
      }
    }
    catch (err) {
      console.log(err);
      return {
        status: 4 // Malformed token
      }
    }
  }
};

async function getUserByToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET || 'debug');
  return (await User.find({ _id: payload.id }))[0];
}
