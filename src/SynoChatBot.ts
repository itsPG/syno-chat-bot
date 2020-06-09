/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import axios from 'axios';
import BodyParser from 'body-parser';
import express from 'express';
import qs from 'querystring';

import BotAction from './BotAction';
import UrlBuilder from './UrlBuilder';
import UserCollection from './UserCollection';

interface onOutgoingFn {
  (payload: Object, action: BotAction): void;
}

class SynoChatBot {
  token: string;
  serverUrl: string;
  urlBuilder: UrlBuilder;
  expressApp: express.Application;
  routePath: string;
  userCollection: UserCollection;
  onOutgoing: onOutgoingFn;

  constructor(
    serverUrl: string,
    token: string,
    expressApp: express.Application,
    routePath: string,
    onOutgoing: onOutgoingFn,
  ) {
    this.token = token;
    this.serverUrl = serverUrl;
    this.expressApp = expressApp;
    this.routePath = routePath;
    this.urlBuilder = new UrlBuilder(serverUrl, token);
    this.userCollection = new UserCollection(this.urlBuilder);
    this.onOutgoing = onOutgoing;

    this.route(routePath);
  }

  route(path: string) {
    this.expressApp.route(path)
      .all(BodyParser.urlencoded({ extended: true }))
      .all(BodyParser.json())
      .all((req, resp, next) => {
        const payload = req.body;

        if (payload.user_id) {
          this.onOutgoing(payload, new BotAction(resp, next));
        } else {
          // not a valid request sent by ChatServer, ignore it
          next();
          return;
        }
      });
  }

  /*
    WARNING: ChatServer seems existing bugs. It can't handle array containing more than one user.
  */
  async send(userIds: Array<number>, text: string) {
    // ChatServer seems can't accept application/json ?
    // use qs.stringify to apply "application / x-www-form-urlencoded" format
    const ret = await axios.post(this.urlBuilder.chatbot(), qs.stringify({
      payload: JSON.stringify({
        user_ids: userIds,
        text,
      }),
    }));

    return ret;
  }

  async sendByUserNames(userNames: Array<string>, text: string) {
    const userIds: Array<number> = await this.userCollection.getIdsByNames(userNames);

    return this.send(userIds, text);
  }


};

export default SynoChatBot;