import React from 'react';
import { FiPlus, FiType, FiImage } from 'react-icons/fi';

const Sidebar = ({ onAddText, onAddImage }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => onAddImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3><FiPlus /> Add Elements</h3>
        <button onClick={() => onAddText('title')} className="sidebar-btn">
          <FiType /> Heading
        </button>
        <button onClick={() => onAddText('subtitle')} className="sidebar-btn">
          <FiType /> Subheading
        </button>
        <button onClick={() => onAddText('body')} className="sidebar-btn">
          <FiType /> Body Text
        </button>
        <label className="sidebar-btn">
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          <FiImage /> Upload Image
        </label>
      </div>
    </div>
  );
};

export default Sidebar;