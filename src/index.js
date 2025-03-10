import React from 'react';
import ReactDOM from 'react-dom/client';
import { NhostProvider } from '@nhost/react';
import nhost from './nhost';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <NhostProvider nhost={nhost}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
  </NhostProvider>
);
