# syno-chat-bot

## Requirement

NodeJS >= v12

Yarn (npm should also be fine, not tested though)

## Setup

```
yarn add syno-chat-bot
```

## Quickstart Guide

Here's an example help you build your own chat bot in 5 minutes.

```
const express = require('express');
const { SynoChatBot } = require('syno-chat-bot');

const app = express();
const chatBot = new SynoChatBot(
  'http://YOUR_DS.org:5000/',
  'YOUR_CHAT_TOKEN',
  app,
  'http://localhost:3003/',
  '/',
  (payload, action) => {
    action.send(JSON.stringify(payload));
  }
);

console.log(`ChatBot is listening`);
app.listen(3003);
```

## Usage

see example/* for more info

## Tasks

- [x] can send Chat webapi without a server
- [x] can create a server handing outgoing bot requests from Chat Server
- [x] can create a temp download link for uploading attachments
- [ ] can download files from Chat Server
- [ ] can handle action buttons & modify post on demand

## License

MIT