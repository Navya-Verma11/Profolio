import React from 'react';
import BackgroundEditor from './BackgroundEditor';
import ElementPalette from './ElementPalette';

const LeftSidebar = ({ dispatch }) => {
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
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sidebar left-sidebar">
      <ElementPalette dispatch={dispatch} />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <BackgroundEditor dispatch={dispatch} />
    </div>
  );
};

export default LeftSidebar;