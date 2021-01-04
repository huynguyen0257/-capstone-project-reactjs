import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import {getToken,clearLocalStorage} from './services'

axios.interceptors.request.use( async config => {
  const token = getToken();
  config.headers = {
    'Authorization': `${token}`,
    // 'Accept': 'application/json',
    // 'Content-Type': 'application/json'
  };
  return config;
})

axios.interceptors.response.use( async res => {
  return res
}, async error => {
  if(!error.response) {
    // window.location.assign(`/no_internet_connection`)
  }
  else if
  (error.response.status === 401 ) {
    clearLocalStorage()
    window.location.reload()
  }
  return Promise.reject(error);
})
ReactDOM.render(
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById('container')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
