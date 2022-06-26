import { useEffect, useState } from 'react';

const TextElement = ({ srcPath, isHtml }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    fetch(srcPath, {
      method: 'GET',
    })
      .then((res) => res.text())
      .then(setText);
  }, [srcPath, setText]);

  return isHtml ? (
    <div
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
  ) : (
    <div>{text}</div>
  );
};

export default TextElement;
