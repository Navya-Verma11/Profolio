import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserData, useNhostClient } from '@nhost/react';
import { gql, useMutation } from '@apollo/client';

const SAVE_PORTFOLIO_MUTATION = gql`
  mutation SavePortfolio($user_id: uuid!, $name: String!, $json_url: String!, $id: uuid) {
    insert_portfolios_one(
      object: { 
        user_id: $user_id, 
        name: $name, 
        json_url: $json_url, 
        id: $id 
      },
      on_conflict: {
        constraint: portfolios_pkey,
        update_columns: [name, json_url]
      }
    ) {
      id
    }
  }
`;

const Header = ({ state, dispatch, onReset }) => {
  const navigate = useNavigate();
  const nhost = useNhostClient();
  const user = useUserData();
  const [savePortfolio] = useMutation(SAVE_PORTFOLIO_MUTATION);

  const handleSave = async () => {
    if (!user) return;

    try {
      const portfolioData = JSON.stringify({
        elements: state.elements,
        background: state.background
      });

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
          json_url: fileUrl,
          id: state.projectId
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
        <nav className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </div>
      
      <div className="header-actions">
        <button onClick={onReset} className="btn reset-btn">Reset</button>
        <button onClick={handleSave} className="btn save-btn">Save</button>
        <Link to="/editor" className="btn new-btn">New Design</Link>
      </div>
    </header>
  );
};

export default Header;