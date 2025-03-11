import React from 'react';
import BackgroundEditor from './BackgroundEditor';
import ElementPalette from './ElementPalette';

const LeftSidebar = ({ dispatch, currentPage }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            id: Date.now(),
            type: 'image',
            src: event.target.result,
            x: 100,
            y: 100,
            width: 200,
            height: 200,
            page: currentPage // Add current page reference
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sidebar left-sidebar">
      <ElementPalette dispatch={dispatch} />
      <div className="upload-section">
        <label className="image-upload-button">
          📁 Upload Image
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={{ display: 'none' }}
          />
        </label>
      </div>
      <BackgroundEditor dispatch={dispatch} currentPage={currentPage} />
    </div>
  );
};

export default LeftSidebar;