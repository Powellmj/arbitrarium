import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import 'bootstrap/dist/css/bootstrap.min.css';
import configureStore from './store/store';

document.addEventListener('DOMContentLoaded', () => {
  const store = configureStore({});
  const root = document.getElementById('root');
  ReactDOM.render(<Root store={store} />, root);
});