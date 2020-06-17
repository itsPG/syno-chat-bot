/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import express from 'express';

class BotAction {
  resp: express.Response<any>;

  nextFn: express.NextFunction;

  constructor(resp: express.Response<any>, nextFn: express.NextFunction) {
    this.resp = resp;
    this.nextFn = nextFn;
  }

  send(text: string, fileUrl?: string) {
    this.resp.json({
      text,
      file_url: fileUrl,
    });
  }

  end() {
    this.resp.end();
  }

  next() {
    this.nextFn();
  }
}

export default BotAction;
