/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

class UrlBuilder {
  baseUrl: string;
  token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  base() {
    return `${this.baseUrl}/webapi/entry.cgi?api=SYNO.Chat.External&token=%22${this.token}%22`;
  }

  incoming() {
    return `${this.base()}&method=incoming&version=2`;
  }

  chatbot() {
    return `${this.base()}&method=chatbot&version=2`;
  }

  userList() {
    return `${this.base()}&method=user_list&version=2`;
  }
};

export default UrlBuilder;