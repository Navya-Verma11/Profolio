import React from 'react';
import ReactDOM from 'react-dom/client';
import { NhostProvider } from '@nhost/react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import nhost from './nhost';
import App from './App';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'YOUR_GRAPHQL_ENDPOINT',  // Replace this with your GraphQL endpoint (e.g., nhost.graphql.getUrl())
  cache: new InMemoryCache(),
  headers: {
    'Authorization': `Bearer ${nhost.auth.getAccessToken()}` // Make sure your authentication is properly configured
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
