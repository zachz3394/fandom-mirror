import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const HtmlViewer = () => {
  const { articleId } = useParams();
  const [ text, setText ] = useState('');


  useEffect(() => {
    fetch(`https://en.wikipedia.org/w/api.php?action=parse&origin=*&format=json&page=${articleId}`)
    .then((x: any) => x.json())
    .then((x: any) => {
      console.log(x.parse.text['*']);
      setText(x.parse.text['*']);
    });
  }, []);

  return (
    <div>
      {(text)}
    </div>
  );
};

export default HtmlViewer;