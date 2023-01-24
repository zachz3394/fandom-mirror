import { ArticleData } from './Article';
import React, { useEffect, useState } from 'react';
import { IoMdClose as CloseIcon } from 'react-icons/io';

interface RecentlyViewedProps {
  title?: string;
  pageId?: string;
}

const RecentlyViewed = (props: RecentlyViewedProps) => {
  const { title, pageId } = props;
  const [ history, setHistory ] = useState<ArticleData[]>([]);

  const updateHistory = (title: string, pageId: string) => {
    if (title !== 'Page Not Found') {
      let storedHistory = JSON.parse(window.localStorage.getItem('history') || '[]');
      storedHistory.unshift({title: title, pageId: pageId});
      storedHistory = storedHistory.filter((item: ArticleData, index: number) => {
        return storedHistory.findIndex((x: ArticleData) => x.title === item.title) === index;
      });
      if (storedHistory.length > 10) {
        storedHistory = storedHistory.slice(0, 10);
      }
      window.localStorage.setItem('history', JSON.stringify(storedHistory));
      setHistory(storedHistory);
    }
  }

  const clearHistory = () => {
    window.localStorage.setItem('history', JSON.stringify([history[0]]));
    setHistory([history[0]]);
  }

  const removeFromHistory = (pageId: string) => {
    let storedHistory = JSON.parse(window.localStorage.getItem('history') || '[]');
    storedHistory = storedHistory.filter((item: ArticleData) => {
      return item.pageId !== pageId;
    });
    setHistory(storedHistory);
    window.localStorage.setItem('history', JSON.stringify(storedHistory));
  }

  useEffect(() => {
    if (title && title !== '' && pageId && pageId !== '') {
      updateHistory(title, pageId);
    }
  }, [ title, pageId ]);

  return(
    <div className='viewed-wrapper'>
      <div className='recently-viewed'>
        <h2>
          Recently Viewed
        </h2>
        {
          history.length > 1 ?
          <div>
            <span onClick={clearHistory} className='clear-history'>clear all</span>
            <ul>
              {history.slice(1).map((article: ArticleData) =>
                <li key={article.title} className='history-entry'>
                  <div
                    className='icon-container'
                    onClick={() => removeFromHistory(article.pageId)}
                  >
                    <CloseIcon className='delete-history-button'/>
                  </div>
                  <a href={`/wiki/${article.pageId}`}>
                    {article.title}
                  </a>
                </li>
              )}
            </ul>
          </div>
          : <div>
            <i> Recently visited pages will show up here </i>
          </div>
        }
      </div>
    </div>
  )
}

export default RecentlyViewed;