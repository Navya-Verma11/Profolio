import React from 'react';

const PageThumbnail = ({ page, index, isActive, dispatch, currentPage }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this page?')) {
      dispatch({ type: 'REMOVE_PAGE', payload: index });
    }
  };

  return (
    <div 
      className={`thumbnail-container ${isActive ? 'active' : ''}`}
      onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: index })}
    >
      <div className="thumbnail-content">
        <div className="thumbnail-preview">
          {/* Add actual preview rendering here */}
          <div className="page-number">{index + 1}</div>
          {page.elements.map(element => (
            <div 
              key={element.id}
              className="element-preview"
              style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`,
                position: 'absolute'
              }}
            />
          ))}
        </div>
        <div className="thumbnail-actions">
          <button 
            className="delete-thumbnail-button"
            onClick={handleDelete}
            disabled={currentPage === 0 && index === 0}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageThumbnail;