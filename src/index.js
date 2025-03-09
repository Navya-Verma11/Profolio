import React from 'react';
import ReactDOM from 'react-dom/client';
import { NhostProvider } from '@nhost/react';
import { ApolloProvider } from '@apollo/client';
import nhost from './nhost';
import apolloClient from './apollo';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <NhostProvider nhost={nhost}>
    <ApolloProvider client={apolloClient}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ApolloProvider>
  </NhostProvider>
);
