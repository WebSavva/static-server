import Head from "next/head";
import Link from "next/link";
import { ListGroup } from "react-bootstrap";

import NodeIcon from "../../components/NodeIcon";
import Breadcrumbs from "../../components/Breadcrumbs";
import { ContentReader } from "../../utils/readContentDir";
import getPath from "../../utils/getPath";
import {
  deserializeNode,
  serializeProps,
  deserializeProps,
  isFile,
} from "../../utils/Node";
import NavigationLink from "../../components/NavigationLink";

export async function getServerSideProps({ params: { folders = [] } }) {
  const [activeFolderId = null] = folders;

  const {
    endNode: activeFolder,
    parentEndNode: parentFolder,
    flatPath: path,
  } = getPath(ContentReader.read(), activeFolderId);

  return {
    props: {
      ...serializeProps({
        activeFolder,
        parentFolder,
        path,
      }),
    },
  };
}

export default function Home(props) {
  const { activeFolder, parentFolder, path } = deserializeProps(props, {
    activeFolder: deserializeNode,
    parentFolder: deserializeNode,
    path: (list) => list.map(deserializeNode),
  });
  
  const getItem = (node) => {
    const content = (
      <span className="d-flex align-items-center">
        <NodeIcon node={node} />

        <span className="ms-2 text-muted">{node.name}</span>
      </span>
    );

    const { link: href } = node;

    return href ? (
      isFile(node) && !node.isSupported ? (
        <a href={href} target="_blank" rel="noreferrer">
          {content}
        </a>
      ) : (
        <Link href={href}>
          <a>{content}</a>
        </Link>
      )
    ) : (
      content
    );
  };

  return (
    <>
      <Head>
        <title>{activeFolder.name}</title>
      </Head>

      <NavigationLink />

      <Breadcrumbs items={path} />

      <ListGroup>
        {parentFolder && (
          <ListGroup.Item>
            <Link href={parentFolder.link}>
              <a>../</a>
            </Link>
          </ListGroup.Item>
        )}

        {activeFolder.children.map((node) => (
          <ListGroup.Item key={node.id}>{getItem(node)}</ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}
