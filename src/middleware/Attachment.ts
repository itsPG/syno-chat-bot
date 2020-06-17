/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import express from 'express';
// import BodyParser from 'body-parser';

import FileProvider from '../FileProvider';

function AttachmentMiddleware(
  expressApp: express.Application,
  path: string,
  fileProvider: FileProvider,
) {
  function handleRequest(req: express.Request, resp: express.Response/* , next */) {
    const { md5 } = req.params;
    const filePath = fileProvider.get(md5);

    if (filePath) {
      resp.download(filePath, '123.txt');
    } else {
      resp.send(`asdf ${req.params.md5}`);
    }
  }

  /*
    ChatServer seems buggy.
    the link of file_url must end with a recognizable name
    e.g. "example.com/aaaaa" is invalid, "example.com/aaaaa.txt" is valid

    to workaround this, we accept an extra route pattern to allow dummy file name
  */
  expressApp
    .route(`${path}/:md5/:name`)
    .all(handleRequest);

  expressApp
    .route(`${path}/:md5`)
    .all(handleRequest);
}

export default AttachmentMiddleware;
