import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'popper.js';
// import BuildDashboard from './BuildDashboard';

ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(<BuildDashboard />, document.getElementById('root'));
registerServiceWorker();