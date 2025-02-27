import React from 'react';
import { useDrop } from 'react-dnd';
import Element from './Element';

const Canvas = ({ elements, setElements, selectedElement, setSelectedElement }) => {
  const [, drop] = useDrop(() => ({
    accept: 'ELEMENT',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const newPosition = {
        x: Math.round(item.position.x + delta.x),
        y: Math.round(item.position.y + delta.y)
      };
      
      setElements(prev => prev.map(el => 
        el.id === item.id ? { ...el, position: newPosition } : el
      ));
    }
  }));

  return (
    <div 
      ref={drop}
      className="canvas"
      onClick={() => setSelectedElement(null)}
    >
      {elements.map(element => (
        <Element
          key={element.id}
          element={element}
          isSelected={selectedElement?.id === element.id}
          setSelectedElement={setSelectedElement}
          setElements={setElements}
        />
      ))}
    </div>
  );
};

export default Canvas;