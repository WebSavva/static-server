import Head from 'next/head';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';

import Breadcrumbs from '../../components/Breadcrumbs';
import { ContentReader } from '../../utils/readContentDir';
import getPath from '../../utils/getPath';
import {
  isFile,
  serializeProps,
  deserializeNode,
  deserializeProps,
} from '../../utils/Node';
import TextElement from '../../components/TextElement';
import Link from 'next/link';
import NavigationLink from '../../components/NavigationLink';

export async function getServerSideProps({ query: { id: fileId = null } }) {
  const contentTree = ContentReader.read();

  const {
    endNode: fileInfo,
    flatPath: path,
    endNodeSiblings: siblings,
  } = getPath(contentTree, fileId) || {};

  if (!fileInfo || !isFile(fileInfo))
    return {
      notFound: true,
    };

  const fileIndex = siblings.findIndex((node) => node.id === fileId);

  const [prevLink, nextLink] = [
    siblings.slice(0, fileIndex).reverse(),
    siblings.slice(fileIndex + 1),
  ].map(
    (list) =>
      list.find((node) => isFile(node) && node.isSupported)?.link || null
  );

  return {
    props: serializeProps({ fileInfo, path, prevLink, nextLink }),
  };
}

export default function FilePage(props) {
  const {
    fileInfo: { name, mimeType, srcPath },
    path,
    prevLink,
    nextLink,
  } = deserializeProps(props, {
    fileInfo: deserializeNode,
    path: (list) => list.map(deserializeNode),
  });

  let content;

  switch (true) {
    case /^image\//.test(mimeType):
      content = <img className="mw-100" src={srcPath} />;
      break;

    case /^(application\/json|text\/)/.test(mimeType):
      content = (
        <TextElement srcPath={srcPath} isHtml={mimeType === 'text/html'} />
      );
      break;

    case /^video\//.test(mimeType):
      content = (
        <video key={srcPath} className="w-100" controls>
          <source src={srcPath} type={mimeType} />
        </video>
      );
  }

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>

      <NavigationLink/> 
      
      <Breadcrumbs items={path} />

      <div className="w-100">
        <div className="d-flex align-items-baseline">
          <h1 className="display-6 mb-3">{name}</h1>

          <div className="ms-auto d-flex align-items-center">
            {prevLink && (
              <Link href={prevLink}>
                <a className=" fs-2 me-2">
                  <BsArrowBarLeft />
                </a>
              </Link>
            )}

            {nextLink && (
              <Link href={nextLink}>
                <a className="ms-auto fs-2">
                  <BsArrowBarRight />
                </a>
              </Link>
            )}
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col">{content}</div>
        </div>
      </div>
    </>
  );
}
