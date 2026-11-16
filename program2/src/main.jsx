// src/main.jsx
// Application entry point — wraps App with BrowserRouter and PassProvider

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { PassProvider } from './context/PassContext.jsx';

// Mount the React application into the #root div defined in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter enables client-side routing via react-router-dom */}
    <BrowserRouter>
      {/* PassProvider makes pass data and operations available app-wide */}
      <PassProvider>
        <App />
      </PassProvider>
    </BrowserRouter>
  </React.StrictMode>
);
