import { createHash } from 'crypto';

import mimeTypeMap from '../public/mimeTypeMap.json';

export class Node {
  constructor(rawNode) {
    this.__NODE__ = true;

    this.name = rawNode.name;
    this.path = rawNode.path;
    this.size = rawNode.size;
    this.type = rawNode.type;
    this.relativePath = rawNode.relativePath;

    this.id = createHash('sha1').update(this.path).digest('hex');
  }
}

export class Directory extends Node {
  constructor(rawNode) {
    super(rawNode);

    this.__NODE__DIRECTORY__ = true;

    this.children = [...(rawNode.children.map(nodeFactory) || [])].sort((prev, next) => parseInt(prev.name, 10) - parseInt(next.name, 10));

    this.isEmpty = this.children.length === 0;

    if (!this.isEmpty)
      this.link = {
        pathname: '/folders/[...folders]',
        query: {
          folders: this.id,
        },
      };
  }
}

class File extends Node {
  constructor(rawNode) {
    super(rawNode);

    this.__NODE__FILE__ = true;

    this.mimeType = mimeTypeMap[rawNode.extension] || null;
    this.extension = rawNode.extension;
    this.isSupported = [
      /^(text|image)\//,
      /video\/mp4/,
      /application\/json/,
    ].some((rule) => rule.test(this.mimeType));

    this.srcPath = (process.env.NEXT_PUBLIC_STATIC_ORIGIN + this.relativePath);
    
    this.link = this.isSupported
      ? {
          pathname: `/file/[id]`,
          query: {
            id: this.id,
          },
        }
      : this.srcPath;
  }
}

export const nodeFactory = (rawNode) =>
  !rawNode
    ? rawNode
    : rawNode.type === 'directory'
    ? new Directory(rawNode)
    : new File(rawNode);

export const isDirectory = (node) =>
  node instanceof Directory || node.type === 'directory';

export const isFile = (node) => node instanceof File || node.type === 'file';

export const serializeProps = (props) =>
  Object.entries(props).reduce(
    (ac, [key, val]) => ({
      ...ac,
      [key]: JSON.stringify(val),
    }),
    {}
  );

export const deserializeNode = (rawNode) => {
  switch (true) {
    case rawNode.__NODE__DIRECTORY__:
      return new Directory(rawNode);

    case rawNode.__NODE__FILE__:
      return new File(rawNode);

    default:
      return new Node(rawNode);
  }
};

export const deserializeProps = (rawProps, mappers = {}) => {
  const primitiveMap = {
    undefined: undefined,
    null: null,
  };

  const props = {};

  for (const [propName, rawPropValue] of Object.entries(rawProps)) {
    if (rawPropValue in primitiveMap) {
      props[propName] = primitiveMap[propName];
    } else {
      const mapper = mappers[propName];

      const propValue = JSON.parse(rawPropValue);

      props[propName] = mapper ? mapper(propValue) : propValue;
    }
  }

  return props;
};
