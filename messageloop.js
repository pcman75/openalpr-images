
const listenForMessages = require("./pubsub.js");

const time = 60 * 1000;

function runner() {
    listenForMessages();
    setTimeout(function() {
        runner();
    }, time);
}

runner();