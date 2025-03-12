import React from 'react';

const RightSidebar = ({ element, dispatch, setSelectedElement }) => {
  const handleDelete = () => {
    dispatch({ type: 'REMOVE_ELEMENT', payload: element.id });
    setSelectedElement(null);
  };

  if (!element) return <div className="sidebar right-sidebar">Select an element to edit</div>;

  return (
    <div className="sidebar right-sidebar">
      <h3>Properties</h3>
      
      {element.type === 'text' && (
        <>
          <div className="property-control">
            <label>Font Size</label>
            <input
              type="number"
              value={element.fontSize}
              onChange={(e) => dispatch({
                type: 'UPDATE_ELEMENT',
                payload: { 
                  id: element.id, 
                  fontSize: Math.max(12, parseInt(e.target.value) || 16)
                }
              })}
              min="12"
              max="72"
            />
          </div>
          <div className="property-control">
            <label>Text Color</label>
            <input
              type="color"
              value={element.color || '#000000'}
              onChange={(e) => dispatch({
                type: 'UPDATE_ELEMENT',
                payload: { id: element.id, color: e.target.value }
              })}
            />
          </div>
          <div className="property-control">
            <label>Font Family</label>
            <select
              value={element.fontFamily}
              onChange={(e) => dispatch({
                type: 'UPDATE_ELEMENT',
                payload: { id: element.id, fontFamily: e.target.value }
              })}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>
          <div className="property-control">
            <label>Hyperlink</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={element.hyperlink || ''}
              onChange={(e) => dispatch({
                type: 'UPDATE_ELEMENT',
                payload: { 
                  id: element.id, 
                  hyperlink: e.target.value || null 
                }
              })}
            />
            <small style={{display: 'block', marginTop: 4}}>
              {element.hyperlink ? "Click text to open link" : "Leave blank to remove link"}
            </small>
          </div>
        </>
      )}

      {element.type === 'line' && (
        <>
          <div className="property-control">
            <label>Line Color</label>
            <input
              type="color"
              value={element.color || '#000000'}
              onChange={(e) => dispatch({
                type: 'UPDATE_ELEMENT',
                payload: { id: element.id, color: e.target.value }
              })}
            />
          </div>
          <div className="property-control">
            <label>Thickness</label>
            <input
              type="number"
              value={element.height || 2}
              onChange={(e) => dispatch({
                type: 'UPDATE_ELEMENT',
                payload: { 
                  id: element.id, 
                  height: Math.max(1, Math.min(20, parseInt(e.target.value) || 2))
                }
              })}
              min="1"
              max="20"
            />
          </div>
        </>
      )}

      <div className="property-control">
        <button onClick={handleDelete} style={{ background: '#dc3545', color: 'white' }}>
          Delete Element
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;