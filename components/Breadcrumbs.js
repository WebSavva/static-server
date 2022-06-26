import { Breadcrumb } from 'react-bootstrap';
import Link from 'next/link';

const Breadcrumbs = ({ items }) => {
  return (
    <Breadcrumb>
      {items.map(({ link, name, id }, i) => (
        <Breadcrumb.Item
          key={id}
          linkAs={({ link, children }) => (
            <Link href={link}>
              <a>{children}</a>
            </Link>
          )}
          linkProps={{ link }}
          active={i + 1 === items.length}
        >
          {name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
