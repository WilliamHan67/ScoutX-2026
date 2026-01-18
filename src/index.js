import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CookiesProvider } from 'react-cookie';
import OrientationWrapper from './orientationWrapper';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <OrientationWrapper>
        <App />
      </OrientationWrapper>
    </CookiesProvider>
  </React.StrictMode>
);
