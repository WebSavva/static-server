import {
  FaRegFileVideo,
  FaHtml5,
  FaJs,
  FaImage,
  FaFolder,
} from 'react-icons/fa';
import { FiFileText } from 'react-icons/fi';

import { isDirectory } from '../utils/Node';

const NodeIcon = ({ node }) => {
  switch (true) {
    case isDirectory(node):
      return <FaFolder className="text-primary" />;

    case /\.js$/.test(node.extension):
      return <FaJs className="text-warning" />;

    case /\.mp4$/.test(node.extension):
      return <FaRegFileVideo className="text-info" />;

    case /\.(gif|png|jpeg|jpg)$/.test(node.extension):
      return <FaImage className="text-primary" />;

    case /\.html$/.test(node.extension):
      return <FaHtml5 className="text-danger" />;
    
    default:
      return <FiFileText className='text-primary'/>
  }
};

export default NodeIcon;
