/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import axios from 'axios';

import UrlBuilder from './UrlBuilder';

class UserCollection {
  usernameMap?: Map<string, number>;
  urlBuilder: UrlBuilder;

  constructor(urlBuilder: UrlBuilder) {
    this.usernameMap = undefined;
    this.urlBuilder = urlBuilder;
  }

  async forceFetch() {
    this.usernameMap = undefined;
    return this.fetch();
  }

  async fetch() {
    if (this.usernameMap !== undefined) {
      return this.usernameMap;
    }

    const userResp = await axios.get(this.urlBuilder.userList());
    this.usernameMap = new Map<string, number>();

    userResp.data.data.users.forEach((user: any) => {
      this.usernameMap?.set(user.username, user.user_id);
    });

    return this.usernameMap;
  }

  async get() {
    return this.fetch();
  }

  async getIdsByNames(userNames: Array<string>): Promise<Array<number>> {
    const notUndefined = function <T>(x: T | undefined): x is T {
      return x !== undefined;
    }
    const usernameMap = await this.get();

    return userNames
      .map((userName: string) => usernameMap?.get(userName) ? usernameMap?.get(userName) : undefined)
      .filter(notUndefined);
  }

};

export default UserCollection;