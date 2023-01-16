import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Article from './Article';
import HtmlViewer from './HtmlViewer';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path='/wiki/:articleId' element={<Article />}/>
        <Route path='/wiki/:articleId/Legends' element={<Article legends={true} />}/>
        <Route path='/html/:articleId' element={<HtmlViewer />}/>
      </Routes>
    </HashRouter>
  );
};

export default App;