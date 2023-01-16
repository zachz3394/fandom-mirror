import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';

interface ArticleProps {
  legends?: boolean;
}

const Article = (props: ArticleProps) => {
  const { legends } = props;
  const { articleId } = useParams();
  const pageId = legends ? articleId + '/Legends' : articleId;

  const [ text, setText ] = useState('');

  const tailRegexSpace = new RegExp('\/revision[^\\s\"]+[\\s]', 'g'); 
  const tailRegexQuote = new RegExp('\/revision[^\\s\"]+[\"]', 'g'); 
  
  const setupLazyLoad = () => {
    var lazyImages = [].slice.call(document.querySelectorAll('.lazyload'));

    if ('IntersectionObserver' in window) {
      let lazyImageObserver = new IntersectionObserver((entries: IntersectionObserverEntry[], _: IntersectionObserver) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            let lazyImage = entry.target as any;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove('lazyload');
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      });

      lazyImages.forEach(function(lazyImage) {
        lazyImageObserver.observe(lazyImage);
      });
    } else {
      console.log('Lazy loading not supported');
    }
  }

  useEffect(() => {
    console.log(pageId);
    fetch(`https://starwars.fandom.com/api.php?action=parse&origin=*&format=json&page=${pageId}`)
    .then((x: any) => x.json())
    .then((x: any) => {
      let t = x.parse.text['*'] 
      t = t.replaceAll(tailRegexSpace, ' ')
      t = t.replaceAll(tailRegexQuote, '"')
      setText(t);
    });
  }, []);

  useEffect(() => {
    setupLazyLoad();
  }, [ text ])

  return (
    <div>
      {parse(text)}
    </div>
  );
};

export default Article;