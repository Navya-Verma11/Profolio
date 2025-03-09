import React from 'react';
import { useUserData, useNhostClient } from '@nhost/react';
import { gql, useMutation } from '@apollo/client';

const SAVE_PORTFOLIO_MUTATION = gql`
  mutation SavePortfolio($user_id: uuid!, $name: String!, $json_url: String!) {
    insert_portfolios_one(object: { user_id: $user_id, name: $name, json_url: $json_url }) {
      id
    }
  }
`;

const Header = ({ onReset, elements, background }) => {
  const nhost = useNhostClient();
  const user = useUserData();
  const [savePortfolio] = useMutation(SAVE_PORTFOLIO_MUTATION);

  const handleSave = async () => {
    if (!user) {
      alert('You must be logged in to save.');
      return;
    }

    try {
      console.log("User:", user);
      console.log("Access Token:", await nhost.auth.getAccessToken());

      const portfolioData = JSON.stringify({ elements, background });

      const file = new File([portfolioData], `portfolio-${Date.now()}.json`, { type: 'application/json' });

      // Upload JSON file to Nhost Storage
      const { fileMetadata, error } = await nhost.storage.upload({ file });

      if (error || !fileMetadata) {
        console.error("Upload Error:", error);
        throw new Error(`Upload Error: ${error?.message || 'Unknown error'}`);
      }

      console.log("File uploaded successfully:", fileMetadata);

      const fileUrl = nhost.storage.getPublicUrl({ fileId: fileMetadata.id });

      // Save portfolio metadata to the database
      const { data, errors } = await savePortfolio({
        variables: {
          user_id: user.id,
          name: `Portfolio ${new Date().toLocaleString()}`,
          json_url: fileUrl,
        },
      });

      if (errors) {
        console.error("GraphQL Error:", errors);
        throw new Error(`GraphQL Error: ${errors.map(err => err.message).join(', ')}`);
      }

      console.log("Portfolio saved:", data);
      alert('Portfolio Saved Successfully!');
    } catch (err) {
      console.error('Error saving portfolio:', err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <header className="header" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#4f46e5', color: 'white' }}>
      <button onClick={onReset} style={{ padding: '8px 16px', background: 'white', color: '#4f46e5', border: 'none', cursor: 'pointer' }}>Reset Canvas</button>
      <button onClick={handleSave} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}>Save Design</button>
      <h1>PROFOLIO</h1>
    </header>
  );
};

export default Header;
