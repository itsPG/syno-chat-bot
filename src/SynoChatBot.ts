/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import express from 'express';
import path from 'path';

import AttachmentMiddleware from './middleware/Attachment';
import ChatApi from './ChatApi';
import FileProvider from './FileProvider';
import OutgoingMiddleware, { OnOutgoingFn } from './middleware/Outgoing';
import UserCollection from './UserCollection';

class SynoChatBot {
  token: string;

  hostUrl: string;

  serverUrl: string;

  chatApi: ChatApi;

  expressApp: express.Application;

  fileProvider: FileProvider;

  routeFilePath: string;

  routePath: string;

  userCollection: UserCollection;

  onOutgoing: OnOutgoingFn;

  constructor(
    serverUrl: string,
    token: string,
    expressApp: express.Application,
    hostUrl: string,
    routePath: string,
    onOutgoing: OnOutgoingFn,
  ) {
    this.token = token;
    this.serverUrl = serverUrl;
    this.expressApp = expressApp;
    this.fileProvider = new FileProvider();
    this.hostUrl = hostUrl;
    this.routePath = routePath;
    this.chatApi = new ChatApi(serverUrl, token);
    this.userCollection = new UserCollection(this.chatApi);
    this.onOutgoing = onOutgoing;

    OutgoingMiddleware(expressApp, routePath, onOutgoing);
    AttachmentMiddleware(expressApp, '/file', this.fileProvider);
    this.routeFilePath = `${hostUrl}/file`;
  }

  createTempFileUrl(filePath?: string) {
    if (filePath === undefined) {
      return undefined;
    }
    const md5 = this.fileProvider.add(filePath);
    const fileName = path.basename(filePath);
    const fileUrl = `${this.routeFilePath}/${md5}/${fileName}`;

    this.fileProvider.purge();
    return fileUrl;
  }

  async send(userIds: Array<number>, text: string, filePath?: string) {
    const fileUrl = filePath ? this.createTempFileUrl(filePath) : undefined;
    return this.chatApi.send(userIds, text, fileUrl);
    // return this.chatApi.send(userIds, 'google', 'http://pg.syno:3003/file/z.txt');
  }

  async sendByUserNames(userNames: Array<string>, text: string, filePath?: string) {
    const userIds: Array<number> = await this.userCollection.getIdsByNames(userNames);
    return this.send(userIds, text, filePath);
  }
}

export default SynoChatBot;
