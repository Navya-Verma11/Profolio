import React from 'react';
import { Resizable } from 'react-resizable';

const ResizableBox = ({ children, width, height, onResize }) => {
  return (
    <Resizable
      width={width}
      height={height}
      onResize={onResize}
      resizeHandles={['se']}
    >
      {children}
    </Resizable>
  );
};

export default ResizableBox;