const express = require('express');
const SynoChatBot = require('./build/SynoChatBot').default;

/* ************************************************** */

const url = 'http://example.com:5000/';
const token = 'jvVnXyPvpmIpMHVkn7bJcmahrjKzAf1kiANf4f18WtCalv6D8Y1EvJp6zi8jX7M5';
const serverRoutePath = '/';
const serverPort = 3003;
// this function will be invoked once the message sent to this bot
const onRequest = (payload, action) => {
  // use action.send to reply this message right now
  action.send(JSON.stringify(payload));
}

/* ************************************************** */

const app = express();
const chatBot = new SynoChatBot(url, token, app, serverRoutePath, onRequest);

chatBot.userCollection.get()
  .then((resp) => {
    // show a Map with key: username, value: user_id
    // ex. Map { 'admin' => 5, 'PG' => 6 }
    console.log(resp);

    resp.forEach((userId, userName) => {
      // use send / sendByUserNames to send msg to the specific user
      /*
        WARNING: ChatServer seems existing bugs. It can't handle array containing more than one user.
      */
      chatBot.send([userId], `send to [${userId}] by id`);
      chatBot.sendByUserNames([userName], `send to [${userName}] by name`);
    })
  });

app.listen(serverPort);
