import React from 'react';
import ReactDOM from 'react-dom/client';
import { NhostProvider } from '@nhost/react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import nhost from './nhost';
import App from './App';

const client = new ApolloClient({
  uri: nhost.graphql.getUrl(),
  cache: new InMemoryCache(),
  headers: () => {
    const token = nhost.auth.getAccessToken();
    console.log("JWT Token:", token);
    
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <NhostProvider nhost={nhost}>
    <ApolloProvider client={client}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ApolloProvider>
  </NhostProvider>
);
