import React from 'react';
import Bootstrap from 'bootstrap';
import JQuery from 'jquery';
import Popper from 'popper.js';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import BuildDashboard from './BuildDashboard';

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<BuildDashboard />, document.getElementById('root'));
registerServiceWorker();
