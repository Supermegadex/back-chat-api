const Server = require('../schemas/server.schema');

const testServers = [
  {
    name: "Test",
    code: "1234",
    members: require('./user')(true),
    channels: require('./channel')(true)
  },
  {
    name: "The Fig Tree",
    code: "5678",
    members: require('./user')(true),
    channels: require('./channel')(true)
  }
]

module.exports = (multiple) => {
  if (multiple) return () => testServers;
  else return async ({ code, id }) => {
    if (code || id) {
      const params = {};
      if (code) params.code = code;
      if (id) params._id = id;
      const server = (await Server.find(params))[0];
      return {
        id: server._id,
        name: server.name,
        code: server.code,
        channels: require('./channel')(true, server._id),
        members: require('./user')(true, { server: server._id })
      };
    }
  }
}
