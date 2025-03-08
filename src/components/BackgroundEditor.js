import React from 'react';

const BackgroundEditor = ({ dispatch }) => {
  const handleColorChange = (e) => {
    dispatch({ type: 'SET_BACKGROUND', payload: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch({ type: 'SET_BACKGROUND', payload: `url(${event.target.result})` });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="property-control">
      <h3>Background</h3>
      <label>
        Background Color:
        <input type="color" onChange={handleColorChange} />
      </label>
      <label>
        Background Image:
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>
    </div>
  );
};

export default BackgroundEditor;