import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import RebelCrest from './Redstarbird.svg';
import RecentlyViewed from './RecentlyViewed';
import Navbar from './Navbar';

const hasLoaded = (selector: string) => {
  const elt = document.querySelector<HTMLElement>(selector);
  if (!elt) return false;
  return true;
}

export interface ArticleData {
  title: string;
  pageId: string;
}

interface ArticleProps {
  legends?: boolean;
}

const Article = (props: ArticleProps) => {
  const { legends } = props;
  const { articleId } = useParams();
  const pageId = legends ? articleId + '/Legends' : articleId;

  const [ text, setText ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ loading, setLoading ] = useState(true);

  const tailRegexSpace = new RegExp('\/revision[^\\s\"]+[\\s]', 'g'); 
  const tailRegexQuote = new RegExp('\/revision[^\\s\"]+[\"]', 'g'); 
  
  // Parsed HTML only contains image source in data-src tags, so this copies to src as needed
  const setupLazyLoad = () => {
    let lazyImages = [].slice.call(document.querySelectorAll('.lazyload'));

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

      lazyImages.forEach((lazyImage: never) => {
        lazyImageObserver.observe(lazyImage);
      });
    } else {
      console.log('Lazy loading not supported');
    }
  }

  // Automatically adds functionality to the [hide] and [show] buttons in .hidable elements
  const setupHideableContent = () => {
    const hideableContainers = document.querySelectorAll<HTMLElement>('.hidable');
    hideableContainers.forEach((hideable: HTMLElement) => {
      const startHidden = hideable.classList.contains('start-hidden');

      const hideableButton = hideable.querySelector<HTMLElement>('.hidable-button')!;
      const hideableContent = hideable.querySelector<HTMLElement>('.hidable-content')!;

      const hideContent = () => {
        hideableContent.style.display = 'none';
        hideableButton.innerHTML = '[Show]';
        hideableButton.onclick = showContent;
      }

      const showContent = () => {
        hideableContent.style.removeProperty('display');
        hideableButton.innerHTML = '[Hide]';
        hideableButton.onclick = hideContent;
      }

      if (startHidden) hideContent();
      else showContent();
    });
  }

  const setupToc = () => {
    const toc = document.querySelector<HTMLElement>('#toc');
    const wrapper = document.querySelector<HTMLElement>('.article-wrapper');
    const content = document.querySelector<HTMLElement>('.mw-parser-output');
    const firstToc = document.querySelector<HTMLElement>('.tocsection-1');

    if (toc != null && wrapper != null && content != null &&  firstToc != null) {
      wrapper.insertBefore(toc, content);

      const copyright = document.createElement('p');
      copyright.classList.add('copyright-notice');
      copyright.innerHTML = `This article is copyrighted by Wookiepedia and is licensed for re-use under the CC-BY-SA. The original article can be found <a href='https://starwars.fandom.com/wiki/${pageId}' target='_blank'>here</a>.`
      content.insertBefore(copyright, content.firstChild);

      const titleElement = document.createElement('h1');
      titleElement.setAttribute('id', 'article-title');
      titleElement.innerHTML = title;
      content.insertBefore(titleElement, content.firstChild);

      const tocWrapper = document.createElement('div');
      tocWrapper.setAttribute('id', 'toc-wrapper');
      tocWrapper.insertBefore(toc, null);
      wrapper.insertBefore(tocWrapper, content);

      const tocIntroLi = document.createElement('li');
      const tocIntroA = document.createElement('a');
      tocIntroA.setAttribute('href', '#article-title');
      tocIntroA.innerHTML = 'Introduction';
      tocIntroLi.classList.add('toclevel-1');
      tocIntroLi.append(tocIntroA);

      firstToc.parentNode!.insertBefore(tocIntroLi, firstToc);

      window.onscroll = updateTocHighlight;
    }
  }

  // Is called on scroll to update our location in the document
  const updateTocHighlight = () => {
    const scroll = document.documentElement.scrollTop;
    const tocEntries = document.querySelectorAll<HTMLElement>('.toclevel-1, .toclevel-2, .toclevel-3, .toclevel-4, .toclevel-5');

    let highlight = null;

    tocEntries.forEach((entry: HTMLElement) => {
      const linkedElementId = entry.querySelector('a')!.getAttribute('href')!;
      const linkedElement = document.getElementById(linkedElementId.substring(1));
      const elementPos = linkedElement!.offsetTop;

      if (elementPos < scroll + 108) {
        highlight = entry;
      }

      entry.classList.remove('active');
    });

    if (highlight != null) {
      (highlight as HTMLElement).classList.add('active');
      const tocElt = document.querySelector('#toc')
      if (tocElt) {
        tocElt.scrollTo(0, Math.max((highlight as HTMLElement).offsetTop - screen.height / 3, 0));
      }
    }
  }

  // We grab the parsed HTML using the Fandom API to use in our body
  useEffect(() => {
    if (pageId != undefined) {
      fetch(`https://starwars.fandom.com/api.php?action=parse&origin=*&format=json&page=${pageId}`)
      .then((x: any) => x.json())
      .then((x: any) => {
        if (x.parse) {
          let t = x.parse.text['*'] 
          t = t.replaceAll(tailRegexSpace, ' ')
          t = t.replaceAll(tailRegexQuote, '"')
          setTitle(x.parse.title);
          setText(t);
        } else {
          setTitle('Page Not Found')
          setText('');
        }
      });
    } else {
      console.error('PageId is undefined');
    }
  }, []);

  useEffect(() => {
    setupLazyLoad();
    setupHideableContent();
    setupToc();
    document.title = `${title} | Capstone`;
  }, [ text, title ])

  useEffect(() => {
    setLoading(!hasLoaded('.mw-parser-output'));
  })

  return (
    <div className='main-container'>
      <Navbar />
      <div style={{display: loading ? 'inline' : 'none'}} className='loading-screen'>
        <div className='loading-symbol'>
          <RebelCrest/>
          <h3 className='loading-text'>
            Loading...
          </h3>
        </div>
      </div>
      <div className='article-wrapper'>
        {parse(text)}
        <RecentlyViewed title={title} pageId={pageId}/>
      </div>
    </div>
  );
};

export default Article;