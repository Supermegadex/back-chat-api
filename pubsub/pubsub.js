// const PubSub = require('@google-cloud/pubsub');

// const projectId = 'seminar-205000';

// const pubsubClient = new PubSub({
//   projectId
// });

debug = process.env.NODE_ENV !== 'production';
var emitter = require('socket.io-emitter')({
  host: "redis.back-chat.com",
  port: "6379",
  password: "fCYJk6g1T7VU"
});

emitter.redis.on('error', onError);

function onError(err) {
  console.log(err);
}

const sendMessage = message => {
  io.to('test').emit('new-message', message);
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
