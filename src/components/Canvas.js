import React from 'react';
import { useDrop } from 'react-dnd';
import Element from './Element';

const Canvas = ({ elements, background, dispatch, selectedElement, setSelectedElement }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'element',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const rect = document.querySelector('.canvas').getBoundingClientRect();
      
      if (offset) {
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            ...item,
            id: Date.now(),
            x: offset.x - rect.left - item.width/2,
            y: offset.y - rect.top - item.height/2,
            color: '#000000',
            fontFamily: 'Arial'
          }
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className="canvas" 
      style={{ 
        background,
        position: 'relative',
        overflow: 'hidden',
        border: isOver ? '2px dashed #007bff' : 'none' 
      }}
      onClick={() => setSelectedElement(null)}
    >
      {elements.map(element => (
        <Element
          key={element.id}
          element={element}
          isSelected={selectedElement?.id === element.id}
          onSelect={setSelectedElement}
          onUpdate={(updates) => dispatch({
            type: 'UPDATE_ELEMENT',
            payload: { id: element.id, ...updates }
          })}
        />
      ))}
    </div>
  );
};

export default Canvas;