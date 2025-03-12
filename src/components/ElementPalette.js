import React from 'react';
import { useDrag } from 'react-dnd';

const elements = [
  { 
    type: 'text', 
    label: 'Title', 
    fontSize: 36,
    width: 400,
    height: 80 
  },
  { 
    type: 'text', 
    label: 'Subtitle', 
    fontSize: 24,
    width: 400,
    height: 60 
  },
  { 
    type: 'text', 
    label: 'Body', 
    fontSize: 16,
    width: 400,
    height: 40 
  },
  { 
    type: 'line',
    label: 'Horizontal Line',
    width: 400,
    height: 2, // Fixed default thickness
    color: '#000000'
  }
];

const DraggableItem = ({ element }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: {
      ...element,
      // Enforce default values for line
      height: element.type === 'line' ? 2 : element.height,
      color: element.type === 'line' ? '#000000' : element.color
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="draggable-item"
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '10px',
        margin: '8px 0',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'grab',
        fontSize: element.type === 'text' ? `${element.fontSize}px` : 'inherit',
        borderBottom: element.type === 'line' ? 
          `${element.height}px solid ${element.color}` : 'none',
        height: element.type === 'line' ? '2px' : 'auto'
      }}
    >
      {element.type === 'line' ? '―' : element.label}
    </div>
  );
};

const ElementPalette = ({ dispatch }) => {
  return (
    <div>
      <h3>Add Elements</h3>
      {elements.map((element, index) => (
        <DraggableItem key={`${element.type}-${index}`} element={element} />
      ))}
    </div>
  );
};

export default ElementPalette;