import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { FiType, FiImage, FiTrash2 } from 'react-icons/fi';

const PropertyPanel = ({ element, canvasBg, setCanvasBg, updateElement, fontOptions }) => {
  const [bgType, setBgType] = useState('color');

  const handleBgImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCanvasBg({ type: 'image', value: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="property-panel">
      <h2>Properties</h2>
      
      {element ? (
        <>
          <div className="section">
            <h3><FiType /> Text Properties</h3>
            <label>Font Family</label>
            <select
              value={element.style.fontFamily}
              onChange={e => updateElement(element.id, { style: { ...element.style, fontFamily: e.target.value }})}
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>

            <label>Font Size</label>
            <input
              type="number"
              value={element.style.fontSize}
              onChange={e => updateElement(element.id, { 
                style: { ...element.style, fontSize: Math.max(parseInt(e.target.value), 12) }
              })}
            />

            <label>Text Color</label>
            <ChromePicker
              color={element.style.color}
              onChangeComplete={color => updateElement(element.id, { 
                style: { ...element.style, color: color.hex }
              })}
              disableAlpha
            />
          </div>

          <button className="delete-btn" onClick={() => updateElement(element.id, null)}>
            <FiTrash2 /> Delete Element
          </button>
        </>
      ) : (
        <div className="section">
          <h3><FiImage /> Canvas Background</h3>
          <div className="bg-selector">
            <button className={bgType === 'color' ? 'active' : ''} onClick={() => setBgType('color')}>
              Color
            </button>
            <button className={bgType === 'image' ? 'active' : ''} onClick={() => setBgType('image')}>
              Image
            </button>
          </div>

          {bgType === 'color' ? (
            <ChromePicker
              color={canvasBg.value}
              onChangeComplete={color => setCanvasBg({ type: 'color', value: color.hex })}
              disableAlpha
            />
          ) : (
            <div className="image-upload">
              <input type="file" accept="image/*" onChange={handleBgImage} />
              {canvasBg.type === 'image' && (
                <div className="image-preview">
                  <img src={canvasBg.value} alt="Background Preview" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyPanel;