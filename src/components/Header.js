import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserData, useNhostClient } from '@nhost/react';
import { gql, useMutation } from '@apollo/client';

const SAVE_PORTFOLIO_MUTATION = gql`
  mutation SavePortfolio($user_id: uuid!, $name: String!, $json_url: String!) {
    insert_portfolios_one(object: { 
      user_id: $user_id, 
      name: $name, 
      json_url: $json_url 
    }) {
      id
    }
  }
`;

const Header = ({ state, dispatch }) => {
  const navigate = useNavigate();
  const nhost = useNhostClient();
  const user = useUserData();
  const [savePortfolio] = useMutation(SAVE_PORTFOLIO_MUTATION);

  const handleSave = async () => {
    if (!user) return;

    try {
      const portfolioData = JSON.stringify(state.pages);
      const file = new File([portfolioData], `portfolio-${Date.now()}.json`, {
        type: 'application/json'
      });

      const { fileMetadata, error } = await nhost.storage.upload({ file });
      if (error) throw error;

      const fileUrl = nhost.storage.getPublicUrl({ fileId: fileMetadata.id });

      const { data, errors } = await savePortfolio({
        variables: {
          user_id: user.id,
          name: `Design ${new Date().toLocaleDateString()}`,
          json_url: fileUrl
        }
      });

      if (errors) throw errors;
      navigate('/dashboard');
      alert('Design saved successfully!');

    } catch (err) {
      console.error('Save error:', err);
      alert('Error saving design');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/dashboard" className="logo">PROFOLIO</Link>
      </div>
      
      <div className="header-actions">
        <button onClick={() => dispatch({ type: 'RESET' })} className="btn reset-btn">
          Reset
        </button>
        <button onClick={handleSave} className="btn save-btn">
          Save Design
        </button>
      </div>
    </header>
  );
};

export default Header;
