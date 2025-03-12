import React from 'react';
import { Rnd } from 'react-rnd';

const Element = ({ element, isSelected, onSelect, onUpdate, scale }) => {
  const handleDragStop = (e, d) => {
    onUpdate({ 
      x: d.x / scale,
      y: d.y / scale,
      // Make sure to preserve the page property
      page: element.page
    });
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    onUpdate({
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height),
      x: position.x / scale,
      y: position.y / scale,
      // Make sure to preserve the page property
      page: element.page
    });
  };

  return (
    <Rnd
      size={{ 
        width: element.width * scale, 
        height: element.height * scale 
      }}
      position={{ 
        x: element.x * scale, 
        y: element.y * scale 
      }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      enableResizing={{
        bottom: true,
        bottomLeft: true,
        bottomRight: true,
        left: true,
        right: true,
        top: true,
        topLeft: true,
        topRight: true
      }}
      style={{
        zIndex: isSelected ? 1000 : 1,
        border: isSelected ? '2px dashed #4f46e5' : 'none',
        background: 'transparent',
        cursor: 'move'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element);
      }}
      data-element-id={element.id}
      data-element-page={element.page}
    >
      {element.type === 'text' ? (
        <div
          contentEditable
          suppressContentEditableWarning
          style={{
            width: '100%',
            height: '100%',
            padding: '8px',
            outline: 'none',
            fontFamily: element.fontFamily,
            fontSize: `${element.fontSize}px`,
            color: element.color
          }}
          onBlur={(e) => onUpdate({ 
            content: e.target.innerHTML,
            page: element.page // Preserve page on updates
          })}
          dangerouslySetInnerHTML={{ __html: element.content || 'Click to edit' }}
        />
      ) : (
        <img
          src={element.src}
          alt="uploaded"
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none' 
          }}
        />
      )}
    </Rnd>
  );
};

export default Element;