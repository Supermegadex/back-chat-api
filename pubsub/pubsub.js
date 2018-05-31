// const PubSub = require('@google-cloud/pubsub');

// const projectId = 'seminar-205000';

// const pubsubClient = new PubSub({
//   projectId
// });

const debug = process.env.NODE_ENV !== 'production';
const redis = require('redis');
const client = redis.createClient({
  host: "redis.back-chat.com",
  port: "6379",
  password: "fCYJk6g1T7VU"
});
const emitter = require('socket.io-emitter')(client);

emitter.redis.on('error', onError);

function onError(err) {
  console.log(err);
}

const sendMessage = message => {
  emitter.to(message.server).emit('new-message', message);
  // const data = JSON.stringify(message);
  // const dataBuffer = Buffer.from(data);
  // pubsubClient
  //   .topic('new-message')
  //   .publisher()
  //   .publish(dataBuffer)
  //   .then(messageId => {
  //     console.log(`Message ${messageId} published.`);
  //   })
  //   .catch(err => {
  //     console.error('ERROR:', err);
  //   });
};

module.exports = {
  sendMessage
}
