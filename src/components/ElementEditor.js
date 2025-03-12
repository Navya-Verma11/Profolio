import React from 'react';
import { Icon } from 'react-icons-kit';
import { trash } from 'react-icons-kit/feather/trash';

const ElementEditor = ({ element, onUpdate, onDelete }) => {
  const handleStyleChange = (property, value) => {
    onUpdate({
      ...element,
      style: {
        ...element.style,
        [property]: value,
      },
    });
  };

  const handleHyperlinkChange = (e) => {
    onUpdate({
      ...element,
      hyperlink: e.target.value || null // Clear if empty
    });
  };

  if (!element) return <div className="element-editor">Select an element to edit</div>;

  return (
    <div className="element-editor">
      <h3>Element Settings</h3>
      
      {element.type === 'text' && (
        <>
          <div className="form-group">
            <label>Font Family</label>
            <select
              value={element.style?.fontFamily || 'Arial'}
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
              value={parseInt(element.style?.fontSize || 16)}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
              min="12"
              max="72"
            />
          </div>

          <div className="form-group">
            <label>Text Color</label>
            <input
              type="color"
              value={element.style?.color || '#000000'}
              onChange={(e) => handleStyleChange('color', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Hyperlink</label>
            <input
              type="url"
              placeholder="Enter URL (https://example.com)"
              value={element.hyperlink || ''}
              onChange={handleHyperlinkChange}
              style={{ width: '100%' }}
            />
            <small className="hint">
              {element.hyperlink 
                ? "Link active - text will be underlined"
                : "Leave blank to remove link"}
            </small>
          </div>
        </>
      )}

      {element.type === 'line' && (
        <div className="form-group">
          <label>Line Color</label>
          <input
            type="color"
            value={element.color || '#000000'}
            onChange={(e) => onUpdate({
              ...element,
              color: e.target.value
            })}
          />
        </div>
      )}

      <div className="form-group">
        <label>Background Color</label>
        <input
          type="color"
          value={element.style?.backgroundColor || '#ffffff'}
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