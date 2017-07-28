import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import CreatePage from './CreatePage';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <div>
      <Route path="/" component={App} exact />
      <Route path="/create" component={CreatePage} exact />
    </div>
  </Router>,
  document.getElementById('root')
);

registerServiceWorker();
