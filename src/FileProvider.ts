/**
 * Copyright (c) PG Tsai.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import crypto from 'crypto';

interface FileItem {
  addedTime: Date;

  filePath: string;
}

class FileProvider {
  fileMap: Map<string, FileItem>;

  constructor() {
    this.fileMap = new Map<string, FileItem>();
  }

  add(filePath: string) {
    const md5 = crypto.createHash('md5').update(filePath).digest('hex');
    this.fileMap.set(md5, {
      addedTime: new Date(),
      filePath,
    });

    return md5;
  }

  get(md5?: string) {
    if (md5 === undefined) {
      return undefined;
    }
    const item = this.fileMap.get(md5);
    return item?.filePath;
  }

  // download link is kept for 300s,
  purge() {
    this.fileMap.forEach((item: FileItem, md5: string) => {
      if (Date.now() > +item.addedTime + 300 * 1000) {
        this.fileMap.delete(md5);
      }
    });
  }
}

export default FileProvider;
