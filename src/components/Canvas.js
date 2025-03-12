import React, { useState, useEffect, forwardRef } from 'react';
import { useDrop } from 'react-dnd';
import Element from './Element';
import AddIcon from '../assets/AddIcon';
import RemoveIcon from '../assets/RemoveIcon';
import ZoomInIcon from '../assets/ZoomInIcon';
import ZoomOutIcon from '../assets/ZoomOutIcon';

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

const Canvas = forwardRef(({ elements, background, dispatch, selectedElement, setSelectedElement, pages, currentPage }, ref) => {
  const [scale, setScale] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'element',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const rect = document.querySelector('.canvas-container').getBoundingClientRect();

      if (offset) {
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            ...item,
            id: Date.now(),
            x: (offset.x - rect.left - item.width / 2) / scale,
            y: (offset.y - rect.top - item.height / 2) / scale,
            color: '#000000',
            fontFamily: 'Arial',
            page: currentPage
          }
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    const updateSize = () => {
      const container = document.querySelector('.canvas-wrapper');
      setContainerSize({
        width: container.offsetWidth,
        height: container.offsetHeight
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      setScale(prev => Math.min(2, Math.max(0.5, prev + (e.deltaY > 0 ? -0.1 : 0.1))));
    }
  };

  const handleAddPage = () => dispatch({ type: 'ADD_PAGE' });

  const handleRemovePage = () => {
    if (pages.length > 1) {
      dispatch({ type: 'REMOVE_PAGE', payload: currentPage });
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPage + 1 });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPage - 1 });
    }
  };

  return (
    <div className="canvas-wrapper" onWheel={handleWheel}>
      <div
        className="canvas-container canvas"
        ref={(node) => {
          drop(node); // Connect drag-and-drop reference
          if (ref) ref.current = node; // Forward the ref correctly
        }}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: A4_WIDTH,
          height: A4_HEIGHT,
          background,
          border: isOver ? '2px dashed #4f46e5' : 'none'
        }}
      >
        {elements
          .filter(element => element.page === currentPage)
          .map(element => (
            <Element
              key={element.id}
              element={element}
              isSelected={selectedElement?.id === element.id}
              onSelect={setSelectedElement}
              onUpdate={(updates) => dispatch({
                type: 'UPDATE_ELEMENT',
                payload: { ...element, ...updates }
              })}
              scale={scale}
            />
          ))}
      </div>

      {/* Control Bar */}
      <div className="control-bar">
        <button className="page-action-button add-button" onClick={handleAddPage}>
          <AddIcon /> New Page
        </button>

        <button className="page-action-button remove-button" onClick={handleRemovePage} disabled={pages.length === 1}>
          <RemoveIcon /> Delete Page
        </button>

        <button className="page-nav-button" onClick={handlePreviousPage} disabled={currentPage === 0}>
          ← Previous Page
        </button>

        <span className="page-info">Page {currentPage + 1} of {pages.length}</span>

        <button className="page-nav-button" onClick={handleNextPage} disabled={currentPage === pages.length - 1}>
          Next Page →
        </button>

        <button className="zoom-button" onClick={() => setScale(s => Math.min(2, s + 0.1))} disabled={scale >= 2}>
          <ZoomInIcon />
        </button>

        <button className="zoom-button" onClick={() => setScale(s => Math.max(0.5, s - 0.1))} disabled={scale <= 0.5}>
          <ZoomOutIcon />
        </button>

        <span className="zoom-percentage">{Math.round(scale * 100)}%</span>
      </div>
    </div>
  );
});

export default Canvas;
