import React, { useCallback } from 'react';
import { useDrag } from 'react-dnd';
import ResizableBox from './ResizableBox';
import { ChromePicker } from 'react-color';

const Element = ({ element, isSelected, setSelectedElement, setElements }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ELEMENT',
    item: element,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  }));

  const handleResize = useCallback((e, { size }) => {
    setElements(prev => prev.map(el => 
      el.id === element.id ? { ...el, size } : el
    ));
  }, [element.id, setElements]);

  const handleDelete = () => {
    setElements(prev => prev.filter(el => el.id !== element.id));
    setSelectedElement(null);
  };

  return (
    <ResizableBox
      width={element.size.width}
      height={element.size.height}
      onResize={handleResize}
    >
      <div
        ref={drag}
        className={`element ${isSelected ? 'selected' : ''}`}
        style={{
          position: 'absolute',
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
          fontFamily: element.fontFamily || 'inherit',
          fontSize: element.fontSize || 'inherit',
          color: element.color || 'inherit',
          backgroundColor: element.backgroundColor || 'transparent',
          ...element.customStyles
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(element);
        }}
      >
        {/* Content rendering */}
        {element.type === 'title' && <h1>{element.content}</h1>}
        {element.type === 'subtitle' && <h2>{element.content}</h2>}
        {element.type === 'text' && <p>{element.content}</p>}
        {element.type === 'image' && (
          <img 
            src={element.content} 
            alt="Uploaded" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: element.borderRadius 
            }} 
          />
        )}
        {element.type === 'link' && (
          <a 
            href={element.url} 
            style={{ color: element.linkColor || '#3498db' }}
            target="_blank" 
            rel="noreferrer"
          >
            {element.linkText || 'Link'}
          </a>
        )}
        
        {isSelected && (
          <div className="element-controls">
            <button className="delete-button" onClick={handleDelete}>×</button>
          </div>
        )}
      </div>
    </ResizableBox>
  );
};

export default Element;