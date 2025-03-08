import React from 'react';
import { Rnd } from 'react-rnd';

const Element = ({ element, isSelected, onSelect, onUpdate }) => {
  const handleDragStop = (e, d) => {
    onUpdate({ x: d.x, y: d.y });
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    onUpdate({
      width: ref.style.width,
      height: ref.style.height,
      ...position
    });
  };

  return (
    <Rnd
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
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
        border: isSelected ? '2px dashed #007bff' : 'none',
        fontFamily: element.fontFamily,
        fontSize: element.fontSize,
        color: element.color,
        background: 'transparent'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element);
      }}
    >
      {element.type === 'text' ? (
        <div
          contentEditable
          suppressContentEditableWarning
          style={{
            width: '100%',
            height: '100%',
            padding: '8px',
            outline: 'none'
          }}
          onBlur={(e) => onUpdate({ content: e.target.innerHTML })}
          dangerouslySetInnerHTML={{ __html: element.content || 'Click to edit' }}
        />
      ) : (
        <img
          src={element.src}
          alt="uploaded"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      )}
    </Rnd>
  );
};

export default Element;