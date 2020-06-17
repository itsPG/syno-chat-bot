/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import axios from 'axios';
import qs from 'qs';

class ChatApi {
  serverUrl: string;

  token: string;

  constructor(serverUrl: string, token: string) {
    this.serverUrl = serverUrl;
    this.token = token;
  }

  /*
    WARNING: ChatServer seems existing bugs. It can't handle array containing more than one user.
  */
  async send(userIds: Array<number>, text: string, fileUrl?: string) {
    const url = `${this.baseUrl()}&method=chatbot&version=2`;
    // ChatServer seems can't accept application/json ?
    // use qs.stringify to apply "application / x-www-form-urlencoded" format
    const payload = JSON.stringify({
      user_ids: userIds,
      text,
      file_url: fileUrl,
    });

    const ret = await ChatApi.sendPost(url, {
      payload,
    });

    return ret;
  }

  async getUserList() {
    return (await this.getUserListImpl()).data.data.users;
  }

  async getUserListImpl() {
    const url = `${this.baseUrl()}&method=user_list&version=2`;
    return ChatApi.sendGet(url);
  }

  async getChannelList() {
    return (await this.getChannelListImpl()).data.data.channels;
  }

  async getChannelListImpl() {
    const url = `${this.baseUrl()}&method=channel_list&version=2`;
    return ChatApi.sendGet(url);
  }

  async getPostList(channelId: number, nextCount: number, prevCount: number, postId?: number) {
    return (await this.getPostListImpl(channelId, nextCount, prevCount, postId)).data.data.posts;
  }

  async getPostListImpl(channelId: number, nextCount: number, prevCount: number, postId?: number) {
    const url = `${this.baseUrl()}&method=post_list&version=2`;
    return ChatApi.sendPost(url, {
      channel_id: channelId,
      next_count: nextCount,
      prev_count: prevCount,
      post_id: postId,
    });
  }

  static async sendGet(url: string) {
    const ret = await axios.get(url);
    if (ret.data.success === false) {
      throw new Error(JSON.stringify(ret.data.error));
    }
    return ret;
  }

  static async sendPost(url: string, params: any) {
    const ret = await axios.post(url, qs.stringify(params));
    if (ret.data.success === false) {
      throw new Error(JSON.stringify(ret.data.error));
    }
    return ret;
  }

  baseUrl() {
    return `${this.serverUrl}/webapi/entry.cgi?api=SYNO.Chat.External&token=%22${this.token}%22`;
  }
}

export default ChatApi;
