require('dotenv').config();
const extractFiles = require("./extractfile.js");
const uploadFile = require("./uploadfile.js");
const fs = require('fs');

const subscriptionName = 'upload-images-sub';
const timeout = 60;

// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub');

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

const { v1: uuid } = require('uuid');

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

    let folder = uuid() + '/';
    fs.mkdirSync(folder);

    let key = message.data.toString();
    extractFiles(key, folder)
      .then(() => uploadFile(folder + key + '.jpg'))
      .then(() => uploadFile(folder + key + '.mp4'))
      .then(() => {
        //delete extracted files
        fs.unlinkSync(folder + key + '.jpg');
        fs.unlinkSync(folder + key + '.mp4');

        //and the folder
        fs.rmdirSync(folder);
      })
      .then(() => {
        // "Ack" (acknowledge receipt of) the message
        message.ack();
      }).catch(console.error);
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);
}

