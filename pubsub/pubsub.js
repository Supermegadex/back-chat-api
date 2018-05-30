const PubSub = require('@google-cloud/pubsub');

const projectId = 'seminar-205000';

const pubsubClient = new PubSub({
  projectId
});

const sendMessage = message => {
  const data = JSON.stringify(message);
  const dataBuffer = Buffer.from(data);
  pubsubClient
    .topic('new-message')
    .publisher()
    .publish(dataBuffer)
    .then(messageId => {
      console.log(`Message ${messageId} published.`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
};

module.exports = {
  sendMessage
}
