const Server = require('../schemas/server.schema');

module.exports = async ({ name, token }) => {
  try {
    const verify = require('../auth/auth').verify;
    const status = await verify({ token });
    if (status !== 1) {
      return {
        status
      }
    }
    const code = await findUniqueCode();
    const server = new Server({ name, code });
    server.save();
    return {
      code,
      status: 1,
      joinServer: require('./joinServer')({ token, code })
    }
  }
  catch (err) {
    console.log(err);
    return {
      status: 5
    }
  }
}

function makeid() {
  let id = "";
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++)
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

function findUniqueCode() {
  return new Promise((resolve, reject) => {
    let serverCode = makeid();
    let tryCode = () => {
      Server.find({ serverCode }).then((err, servers) => {
        if (!servers) {
          resolve(serverCode);
        }
        else {
          serverCode = makeid();
          tryCode();
        }
      });
    };
    tryCode();
  });
}
