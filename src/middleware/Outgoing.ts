/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import express from 'express';
import BodyParser from 'body-parser';

import BotAction from '../BotAction';

export interface OnOutgoingFn {
  (payload: Object, action: BotAction): void;
}

function isValidRespFromChatServer(payload: any) {
  return payload.user_id !== undefined;
}

function OutgoingMiddleware(
  expressApp: express.Application,
  path: string,
  onOutgoing: OnOutgoingFn,
) {
  expressApp.route(path)
    .all(BodyParser.urlencoded({ extended: true }))
    .all(BodyParser.json())
    .all((req, resp, next) => {
      const payload = req.body;

      if (isValidRespFromChatServer(payload)) {
        onOutgoing(payload, new BotAction(resp, next));
      } else {
        resp.send('not a valid ChatServer request');
      }
    });
}

export default OutgoingMiddleware;
