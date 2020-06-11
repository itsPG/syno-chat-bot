/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import BodyParser from 'body-parser';
import express from 'express';

import BotAction from './BotAction';
import ChatApi from './ChatApi';
import UserCollection from './UserCollection';

interface OnOutgoingFn {
  (payload: Object, action: BotAction): void;
}

class SynoChatBot {
  token: string;

  serverUrl: string;

  chatApi: ChatApi;

  expressApp: express.Application;

  routePath: string;

  userCollection: UserCollection;

  onOutgoing: OnOutgoingFn;

  constructor(
    serverUrl: string,
    token: string,
    expressApp: express.Application,
    routePath: string,
    onOutgoing: OnOutgoingFn,
  ) {
    this.token = token;
    this.serverUrl = serverUrl;
    this.expressApp = expressApp;
    this.routePath = routePath;
    this.chatApi = new ChatApi(serverUrl, token);
    this.userCollection = new UserCollection(this.chatApi);
    this.onOutgoing = onOutgoing;

    this.route(routePath);
  }

  route(path: string) {
    function isValidRespFromChatServer(payload: any) {
      return payload.user_id !== undefined;
    }

    this.expressApp.route(path)
      .all(BodyParser.urlencoded({ extended: true }))
      .all(BodyParser.json())
      .all((req, resp, next) => {
        const payload = req.body;

        if (isValidRespFromChatServer(payload)) {
          this.onOutgoing(payload, new BotAction(resp, next));
        } else {
          next();
        }
      });
  }

  async send(userIds: Array<number>, text: string) {
    return this.chatApi.send(userIds, text);
  }

  async sendByUserNames(userNames: Array<string>, text: string) {
    const userIds: Array<number> = await this.userCollection.getIdsByNames(userNames);
    return this.send(userIds, text);
  }
}

export default SynoChatBot;
