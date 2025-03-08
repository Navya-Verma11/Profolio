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
                payload: { id: element.id, fontSize: parseInt(e.target.value) }
              })}
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