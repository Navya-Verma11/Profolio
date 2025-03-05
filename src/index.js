import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './style.css';
import { NhostProvider } from '@nhost/react';
import nhost from './nhost';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <NhostProvider nhost={nhost}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </NhostProvider>,
);