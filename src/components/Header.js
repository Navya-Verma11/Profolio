import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserData, useNhostClient } from '@nhost/react';
import { gql } from '@apollo/client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const SAVE_PORTFOLIO = gql`
  mutation SavePortfolio($data: jsonb!, $background: String!, $name: String!) {
    insert_portfolios_one(object: { data: $data, background: $background, name: $name }) {
      id
    }
  }
`;

const Header = ({ state, dispatch }) => {
  const navigate = useNavigate();
  const nhost = useNhostClient();
  const user = useUserData();
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState('');

  const handleSave = async () => {
    if (!user) {
      alert('You need to be logged in to save your portfolio.');
      return;
    }

    if (!name.trim()) {
      alert('Please enter a name for your portfolio.');
      return;
    }

    console.log('📥 State before saving:', state);

    const elements = state?.pages?.[0]?.elements;
    const background = state?.pages?.[0]?.background || '#ffffff';

    if (!elements || elements.length === 0) {
      alert('No data to save');
      return;
    }

    setIsSaving(true);

    try {
      // ✅ Save to backend
      const { data, error } = await nhost.graphql.request(SAVE_PORTFOLIO, {
        data: elements,
        background,
        name, // ✅ Include name in mutation
      });

      if (error) throw error;

      alert('Portfolio saved successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Save error:', err);
      alert('Failed to save portfolio.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    const canvasElement = document.querySelector('.canvas-container');
    if (!canvasElement) {
      alert('Nothing to download');
      return;
    }

    try {
      const canvas = await html2canvas(canvasElement, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('portfolio.pdf');
    } catch (err) {
      console.error('❌ Download error:', err);
      alert('Failed to download PDF');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/dashboard" className="logo">
          PROFOLIO
        </Link>
      </div>

      <div className="header-actions">
        {/* ✅ Input for naming portfolio */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Portfolio Name"
          className="name-input"
        />
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="btn reset-btn"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          className={`btn save-btn ${isSaving ? 'saving' : ''}`}
          disabled={isSaving}
          style={{
            backgroundColor: isSaving ? '#94a3b8' : '#10b981',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {isSaving ? 'Saving...' : 'Save Design'}
        </button>
        <button
          onClick={handleDownload}
          className="btn download-btn"
          style={{
            backgroundColor: '#6366f1',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => (e.target.style.background = '#4f46e5')}
          onMouseOut={(e) => (e.target.style.background = '#6366f1')}
        >
          Download PDF
        </button>
      </div>
    </header>
  );
};

export default Header;
