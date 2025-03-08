import React from 'react';
import { v4 as uuid } from 'uuid';

const elementsConfig = [
  { type: 'title', label: 'Title' },
  { type: 'subtitle', label: 'Subtitle' },
  { type: 'text', label: 'Text Block' },
  { type: 'image', label: 'Image' },
  { type: 'link', label: 'Link' }
];

const Sidebar = ({ setElements }) => {
  const handleAddElement = (type) => {
    const newElement = {
      id: uuid(),
      type,
      content: '',
      position: { x: 100, y: 100 + (Math.random() * 100) },
      size: { width: 200, height: 50 }
    };
    
    if (type === 'image') newElement.content = 'https://via.placeholder.com/200x150';
    if (type === 'link') newElement.content = 'https://example.com';
    
    setElements(prev => [...prev, newElement]);
  };

  return (
    <div className="sidebar">
      <h3>Add Elements</h3>
      {elementsConfig.map((item) => (
        <button 
          key={item.type}
          className="element-button"
          onClick={() => handleAddElement(item.type)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
