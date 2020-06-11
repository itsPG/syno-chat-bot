/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

const { ChatApi } = require('syno-chat-bot');
const {
  url,
  token,
} = require('./example_config');

const chatApi = new ChatApi(url, token);

chatApi.getUserList()
  .then((resp) => {
    console.log('========== getUserList ==========');
    console.log(resp);
    return chatApi.getChannelList();
  })
  .then((resp) => {
    console.log('========== getChannelList ==========');
    console.log(resp);
    if (resp.length > 0) {
      return chatApi.getPostList(resp[0].channel_id, 0, 3);
    }
    return undefined;
  })
  .then((resp) => {
    if (resp !== undefined) {
      console.log('========== getPostList ==========');
      console.log(resp);
    }
  });
