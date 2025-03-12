import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserData, useNhostClient } from '@nhost/react';
import { gql } from '@apollo/client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';


const Header = ({ state, dispatch }) => {
  const navigate = useNavigate();
  const nhost = useNhostClient();
  const user = useUserData();
  const [isSaving, setIsSaving] = useState(false); 
  
  const SAVE_PORTFOLIO = gql`
  mutation SavePortfolio($data: jsonb!, $background: String!) {
    insert_portfolios_one(object: { data: $data, background: $background }) {
      id
    }
  }
`;

const handleSave = async () => {
  if (!user) {
    alert('You need to be logged in to save your portfolio.');
    return;
  }

  console.log('State before saving:', state);
  console.log('State elements:', state?.pages?.[0]?.elements);

  const elements = state?.pages?.[0]?.elements; 
  const background = state?.background || '#ffffff';

  if (!elements || elements.length === 0) {
    alert('No data to save');
    return;
  }

  setIsSaving(true);

  try {
    const { data, error } = await nhost.graphql.request(SAVE_PORTFOLIO, {
      data: elements, 
      background
    });

    if (error) throw error;

    alert('Portfolio saved successfully!');
    navigate('/dashboard');
  } catch (err) {
    console.error('Save error:', err);
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
        scale: 2, // High resolution
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('portfolio.pdf');
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download PDF');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/dashboard" className="logo">PROFOLIO</Link>
      </div>

      <div className="header-actions">
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="btn reset-btn"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          className="btn save-btn"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Design'}
        </button>
        <button
          onClick={handleDownload}
          className="btn download-btn"
        >
          Download PDF
        </button>
      </div>
    </header>
  );
};

export default Header;
