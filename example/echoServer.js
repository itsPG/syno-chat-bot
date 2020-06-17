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
// the callback of SynoChatBot will be invoked whenever messages sent to this bot
const chatBot = new SynoChatBot(url, token, app, hostUrl, serverRoutePath, (payload, action) => {
  console.log(payload);
  // use action.send to reply message
  action.send(JSON.stringify(payload));

  // you may use chatBot.createTempFileUrl(YOUR_PATH)
  // as the second params to send file to ChatServer
  // e.g.
  // action.send('sending a file as attachment', chatBot.createTempFileUrl('/tmp/123.txt'));
});

console.log(`ChatBot is listening ${serverPort} ${chatBot.routePath}`);
app.listen(serverPort);
