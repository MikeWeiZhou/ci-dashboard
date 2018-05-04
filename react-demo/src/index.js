import React from 'react';
import Bootstrap from 'bootstrap';
import JQuery from 'jquery';
import Popper from 'popper.js';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root2'));
registerServiceWorker();
