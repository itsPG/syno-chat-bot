/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

const express = require('express');
const { SynoChatBot } = require('syno-chat-bot');
const {
  url,
  token,
  serverRoutePath,
  serverPort,
} = require('./example_config');

const app = express();
// the callback of SynoChatBot will be invoked whenever messages sent to this bot
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const chatBot = new SynoChatBot(url, token, app, serverRoutePath, (payload, action) => {
  console.log(payload);
  // use action.send to reply message
  action.send(JSON.stringify(payload));
});

console.log(`ChatBot is listening ${serverPort}`);
app.listen(serverPort);
