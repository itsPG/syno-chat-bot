/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

const express = require('express');
const { SynoChatBot } = require('syno-chat-bot'); // eslint-disable-line
const {
  url,
  token,
  hostUrl,
  serverRoutePath,
  serverPort,
} = require('./config');

const app = express();
const chatBot = new SynoChatBot(
  url, token, app, hostUrl, serverRoutePath,
  (payload, action) => {
    console.log(payload);
    // no reply for incoming msg
    action.end();
  },
);

/*
  this demostrates how to send text without callback
*/

// 1. get user map
chatBot.userCollection.getUsernameMap()
  .then((usernameMap) => {
    console.log(usernameMap); // ex. Map { 'admin' => 5, 'PG' => 4 }

    // 2. choose those who you want to talk to
    // (in this example, we send text to all chat users)

    if (usernameMap.size === 0) {
      console.log('no users, cannot demo');
      return;
    }

    if (usernameMap.size > 10) {
      console.log('skip demo if the user size > 10 (for preventing sending too much posts)');
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const [username, userId] of usernameMap.entries()) {
      console.log(`sending msg to id:${userId} name:${username}`);
      // 3. use send / sendByUserNames to send text to user
      /*
        WARNING: ChatServer seems existing bugs.
        It can't handle array containing more than one user.
      */
      chatBot.send([userId], `send text by user_id ${userId}`);
      chatBot.sendByUserNames([username], `send text by username ${username}`);
      break;
    }
  });

console.log(`ChatBot is listening ${serverPort}`);
// app.listen(serverPort);
