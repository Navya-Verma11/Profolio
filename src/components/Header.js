import React, { useState } from 'react';

const Header = ({ onReset, onSave }) => {
  const [isSaving, setIsSaving] = useState(false); // Track saving state

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(); // Call the actual save function
    setIsSaving(false);
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
          onClick={handleSave} // Uses internal function to manage state
          disabled={isSaving} 
          style={{
            padding: '12px 24px',
            background: isSaving ? '#94a3b8' : '#10b981',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '1.1rem',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: '600'
          }}
          onMouseOver={(e) => {
            if (!isSaving) e.target.style.background = '#059669';
          }}
          onMouseOut={(e) => {
            if (!isSaving) e.target.style.background = '#10b981';
          }}
        >
          {isSaving ? 'Saving...' : 'Save Design'}
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
    </header>
  );
};

export default Header;
