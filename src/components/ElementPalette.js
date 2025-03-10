import React from 'react';
import { useDrag } from 'react-dnd';

const textElements = [
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
  }
];

const DraggableItem = ({ label, fontSize, type, width, height }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: { 
      type,
      fontSize,
      width,
      height,
      content: label,
      x: 100,
      y: 100
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
        fontSize: `${fontSize}px`,
        padding: '10px',
        margin: '8px 0',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'grab'
      }}
    >
      {label}
    </div>
  );
};

const ElementPalette = ({ dispatch }) => {
  return (
    <div>
      <h3>Add Elements</h3>
      {textElements.map((element) => (
        <DraggableItem
          key={element.label}
          label={element.label}
          type={element.type}
          fontSize={element.fontSize}
          width={element.width}
          height={element.height}
        />
      ))}
    </div>
  );
};



export default ElementPalette;