import React from 'react';
import { Rnd } from 'react-rnd';

const Element = ({ element, isSelected, onSelect, onUpdate, scale }) => {
  const handleDragStop = (e, d) => {
    onUpdate({ 
      x: d.x / scale,
      y: d.y / scale,
      page: element.page
    });
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    onUpdate({
      width: parseInt(ref.style.width),
      height: element.type === 'line' ? element.height : parseInt(ref.style.height),
      x: position.x / scale,
      y: position.y / scale,
      page: element.page
    });
  };

  const renderContent = () => {
    switch(element.type) {
      case 'text':
        return (
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
              color: element.color,
              background: 'transparent',
              textDecoration: element.hyperlink ? 'underline' : 'none'
            }}
            onBlur={(e) => onUpdate({ 
              content: e.target.innerHTML,
              page: element.page
            })}
            dangerouslySetInnerHTML={{ __html: element.content || 'Click to edit' }}
          />
        );
      
      case 'line':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderBottom: `${element.height}px solid ${element.color || '#000000'}`
            }}
          />
        );

      case 'image':
        return (
          <img
            src={element.src}
            alt="uploaded"
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Rnd
      size={{ 
        width: element.width * scale, 
        height: element.type === 'line' ? 20 * scale : element.height * scale // Minimum height for draggability
      }}
      position={{ 
        x: element.x * scale, 
        y: element.y * scale 
      }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      enableResizing={element.type !== 'line' ? {
        bottom: true,
        bottomLeft: true,
        bottomRight: true,
        left: true,
        right: true,
        top: true,
        topLeft: true,
        topRight: true
      } : false}
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
      {element.type === 'text' && element.hyperlink ? (
        <a
          href={element.hyperlink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          {renderContent()}
        </a>
      ) : renderContent()}
    </Rnd>
  );
};

export default Element;