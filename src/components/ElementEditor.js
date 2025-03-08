import React from 'react';
import { Icon } from 'react-icons-kit';
import { trash } from 'react-icons-kit/feather/trash';

const ElementEditor = ({ element, onUpdate, onDelete }) => {
  if (!element) return <div className="element-editor">Select an element to edit</div>;

  const handleStyleChange = (property, value) => {
    onUpdate({
      ...element,
      style: {
        ...element.style,
        [property]: value,
      },
    });
  };

  return (
    <div className="element-editor">
      <h3>Element Settings</h3>
      {element.type === 'text' && (
        <>
          <div className="form-group">
            <label>Font Family</label>
            <select
              value={element.style.fontFamily}
              onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>

          <div className="form-group">
            <label>Font Size (px)</label>
            <input
              type="number"
              value={parseInt(element.style.fontSize)}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
            />
          </div>

          <div className="form-group">
            <label>Text Color</label>
            <input
              type="color"
              value={element.style.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label>Background Color</label>
        <input
          type="color"
          value={element.style.backgroundColor}
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
        />
      </div>

      <button className="delete-btn" onClick={onDelete}>
        <Icon icon={trash} size={16} /> Delete Element
      </button>
    </div>
  );
};

export default ElementEditor;