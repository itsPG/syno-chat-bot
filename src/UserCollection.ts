/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import ChatApi from './ChatApi';

class UserCollection {
  usernameMap?: Map<string, number>;

  userMap?: Map<number, any>;

  chatApi: ChatApi;

  constructor(chatApi: ChatApi) {
    this.usernameMap = undefined;
    this.chatApi = chatApi;
  }

  async forceFetch() {
    this.usernameMap = undefined;
    this.userMap = undefined;
    return this.fetch();
  }

  async fetch() {
    if (this.userMap !== undefined) {
      return;
    }

    const userResp = await this.chatApi.getUserList();
    this.userMap = new Map<number, any>();
    this.usernameMap = new Map<string, number>();

    userResp.forEach((user: any) => {
      this.usernameMap?.set(user.username, user.user_id);
      this.userMap?.set(user.user_id, user);
    });
  }

  async getUserMap() {
    await this.fetch();
    return this.userMap;
  }

  async getUsernameMap() {
    await this.fetch();
    return this.usernameMap;
  }

  async getIdsByNames(userNames: Array<string>): Promise<Array<number>> {
    const notUndefined = function <T>(x: T | undefined): x is T {
      return x !== undefined;
    };
    const usernameMap = await this.getUsernameMap();

    return userNames
      .map(
        (userName: string) => (usernameMap?.get(userName) ? usernameMap?.get(userName) : undefined),
      )
      .filter(notUndefined);
  }
}

export default UserCollection;
