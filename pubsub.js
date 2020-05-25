require('dotenv').config();
const extract_files = require("./extractfile.js");

const subscriptionName = 'upload-images-sub';
const timeout = 60;

// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

module.exports = function () {
  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = message => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    extract_files(message.data.toString()).then(
      data => {
        // "Ack" (acknowledge receipt of) the message
        message.ack();
      },
      err => { console.error("Error extracting files:\n" + err); }
    );
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);
}

