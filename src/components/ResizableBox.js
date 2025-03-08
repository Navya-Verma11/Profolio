import React, { useState, useCallback } from 'react';

const ResizableBox = React.forwardRef(({ 
  children, 
  width, 
  height, 
  x, 
  y, 
  onResize, 
  onClick, 
  isSelected 
}, ref) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width, height });

  const handleMouseDown = useCallback((e) => {
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width, height });
    e.preventDefault();
  }, [width, height]);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    onResize({
      width: startSize.width + deltaX,
      height: startSize.height + deltaY,
    });
  }, [isResizing, startPos, startSize, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: `${width}px`,
        height: `${height}px`,
        border: isSelected ? '2px solid #4a90e2' : 'none',
        borderRadius: '4px',
        cursor: 'move',
        userSelect: 'none',
      }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
      {isSelected && (
        <div
          className="resize-handle"
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
  );
});

export default ResizableBox;