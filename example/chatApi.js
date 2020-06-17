/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

const { ChatApi } = require('syno-chat-bot'); // eslint-disable-line
const {
  url,
  token,
} = require('./config');

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
      // get posts of the first channel.
      // starting from the lastest one, get the next 0 post and the previous 3 posts.
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
