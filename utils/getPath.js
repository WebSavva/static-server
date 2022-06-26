import { Directory, isDirectory } from "./Node";

export default function getPath(node, key, keyName = "id") {
    // topmost node case
    if (key === null) {
      return {
        parentEndNode: null,
        flatPath: [node],
        unflattenedPath: {
          ...node,
          next: null,
        },
        endNode: node,
        endNodeSiblings: [],
      };
    }
  
    // Initialisation of key parameters
    const flatPath = [];
    let endNode = null;
    let isFound = false;
    let endNodeSiblings = [];
  
    // Collecth path handler
    const collectPath = (node, siblings = []) => {
      if (isFound) return;
  
      flatPath.push(node);
  
      if (node[keyName] === key) {
        endNode = node;
  
        endNodeSiblings = [...siblings];
  
        isFound = true;
        return;
      } else if (isDirectory(node) && !node.isEmpty) {
        const siblings = [...node.children];
  
        node.children.forEach((currentNode) =>
          collectPath(currentNode, siblings)
        );
      }
  
      if (isFound) return;
  
      flatPath.pop();
    };
  
    // Path collecting
    collectPath(node);
  
    // Path unflattening
    let unflattenedPath = {};
  
    if (isFound) {
      unflattenedPath = {
        ...node,
      };
  
      flatPath.reduce((ac, node) => {
        const nextNode = {
          ...node,
        };
  
        ac.next = nextNode;
  
        return nextNode;
      }, unflattenedPath);
    }
  
    // Parent node lookup
    const parentEndNode = flatPath[flatPath.length - 2] || null;
  
    return {
      flatPath,
      unflattenedPath,
      endNode,
      endNodeSiblings,
      parentEndNode,
    };
  }
  