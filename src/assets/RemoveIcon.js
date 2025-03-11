import React from 'react';

const RemoveIcon = ({ size = 20, color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19 13H5v-2h14v2z" />
  </svg>
);

export default RemoveIcon;
