import directoryTree from "directory-tree";
import getConfig from "next/config";

import { Directory } from "./Node";

const {
  serverRuntimeConfig: { contentDir },
} = getConfig();

export class ContentReader {
  static result = null;

  static update() {
    const cb = (item, path) => {
      item.relativePath = path.replace(contentDir, "");
    };

    const result = new Directory(
      directoryTree(
        contentDir,
        {
          attributes: ["size", "type", "extension", "mtimeMs"],
        },
        cb,
        cb
      )
    );
    
    this.result = result;
  }

  static read() {
    this.update();

    return this.result;
  }
}

export function getNodeByKey(node, key, keyName = "id") {
  if (node[keyName] === key) {
    return node;
  } else if (node.children) {
    node.children.forEach((node) => getNodeByKey(node, key, keyName));
  }
}
