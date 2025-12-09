import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom'
import store from './redux/app/store.js';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter> 
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
)
