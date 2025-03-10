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
    <header className="header" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 2rem',
      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
      color: 'white',
      position: 'relative',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={onReset}
          style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: '600'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
        >
          Reset Canvas
        </button>
        <button 
          onClick={handleSave}
          style={{
            padding: '12px 24px',
            background: '#10b981',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: '600'
          }}
          onMouseOver={(e) => e.target.style.background = '#059669'}
          onMouseOut={(e) => e.target.style.background = '#10b981'}
        >
          Save Design
        </button>
      </div>
      <h1 style={{
        margin: 0,
        fontSize: '2.5rem',
        fontWeight: '800',
        letterSpacing: '-1px',
        background: 'linear-gradient(45deg, #fff 30%, #e0e7ff 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        PROFOLIO
      </h1>
      <nav>
        <Link to="/dashboard" style={{ color: 'white', marginRight: '1rem' }}>Dashboard</Link>
        <Link to="/profile" style={{ color: 'white' }}>Profile</Link>
      </nav>
    </header>
  );
};

export default Header;
