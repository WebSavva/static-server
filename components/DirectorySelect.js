import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import { isDirectory } from "../utils/Node";

export default function DirectorySelect({ path = [], onChange = () => {} }) {
  const truncateName = (name) =>
    name.length > 20 ? name.slice(0, 20) + "..." : name;

  const formattedPath = [
    {
      title: path[0].name,
      items: [
        {
          ...path[0],
          isActive: true,
        },
      ],
    },
    ...path.reduce((ac, node) => {
      const subDirectories = (node.children || []).filter(isDirectory);

      if (!subDirectories.length) return ac;

      const activeNode = subDirectories.find((subNode) =>
        path.find((activeNode) => activeNode.id === subNode.id)
      );

      return [
        ...ac,
        {
          title: truncateName(activeNode?.name ?? ""),
          items: subDirectories.map((node) => ({
            ...node,
            isActive: activeNode?.id === node.id,
          })),
        },
      ];
    }, []),
  ];

  return (
    <div className="d-flex flex-wrap">
      {formattedPath.map(({ title, items }, i, list) => (
        <div key={title} className="d-flex me-3 mb-3 align-items-center">
          <DropdownButton variant="secondary" className="me-1" title={title}>
            {items.map(({ isActive, id, name }) => (
              <Dropdown.Item
                key={id}
                as="button"
                variant="link"
                active={isActive}
                onClick={() => onChange(id)}
              >
                {truncateName(name)}
              </Dropdown.Item>
            ))}
          </DropdownButton>

          {i < list.length - 1 && <span>/</span>}
        </div>
      ))}
    </div>
  );
}
