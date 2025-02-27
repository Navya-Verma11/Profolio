import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

const ThemeSelector = ({ theme, setTheme }) => {
  const [showPicker, setShowPicker] = useState(false);
  
  const presetColors = [
    '#2c3e50', '#3498db', '#e74c3c', 
    '#2ecc71', '#f1c40f', '#9b59b6'
  ];

  return (
    <div className="theme-selector">
      <h3>Theme Settings</h3>
      
      <div className="preset-colors">
        {presetColors.map(color => (
          <div 
            key={color}
            className="color-swatch"
            style={{ backgroundColor: color }}
            onClick={() => setTheme({ ...theme, primaryColor: color })}
          />
        ))}
      </div>
      
      <button onClick={() => setShowPicker(!showPicker)}>
        Custom Color
      </button>
      
      {showPicker && (
        <ChromePicker
          color={theme.primaryColor}
          onChangeComplete={(color) => setTheme({ ...theme, primaryColor: color.hex })}
        />
      )}
      
      <label>
        Background Image:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
              setTheme({ ...theme, backgroundImage: reader.result });
            };
            reader.readAsDataURL(file);
          }}
        />
      </label>
    </div>
  );
};

export default ThemeSelector;