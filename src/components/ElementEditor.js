import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { useDropzone } from 'react-dropzone';

const ElementEditor = ({ selectedElement, setElements }) => {
  const [edits, setEdits] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(null);
  
  // Initialize edits when element changes
  useEffect(() => {
    if (selectedElement) setEdits({ ...selectedElement });
  }, [selectedElement]);

  // Handle file drops for image upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: {'image/*': []},
    onDrop: files => {
      const reader = new FileReader();
      reader.onload = () => {
        setEdits(prev => ({ ...prev, content: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    }
  });

  const handleSave = () => {
    setElements(prev => prev.map(el => 
      el.id === selectedElement.id ? { ...el, ...edits } : el
    ));
  };

  const handleStyleChange = (prop, value) => {
    setEdits(prev => ({
      ...prev,
      customStyles: { ...prev.customStyles, [prop]: value }
    }));
  };

  if (!selectedElement) return <div className="editor-placeholder">Select an element to edit</div>;

  return (
    <div className="element-editor">
      <h3>Edit {selectedElement.type}</h3>

      {selectedElement.type === 'text' && (
        <div className="style-controls">
          <label>Font Family:
            <select 
              value={edits.fontFamily || ''}
              onChange={(e) => setEdits(prev => ({ ...prev, fontFamily: e.target.value }))}
            >
              <option value="">Default</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </label>

          <label>Font Size:
            <input
              type="number"
              value={edits.fontSize || ''}
              onChange={(e) => setEdits(prev => ({ ...prev, fontSize: `${e.target.value}px` }))}
            />
          </label>
        </div>
      )}

      {selectedElement.type === 'image' && (
        <div className="image-upload" {...getRootProps()}>
          <input {...getInputProps()} />
          <button>Upload Image</button>
          {edits.content && (
            <div className="image-preview">
              <img src={edits.content} alt="Preview" />
            </div>
          )}
        </div>
      )}

      {selectedElement.type === 'link' && (
        <div className="link-controls">
          <label>Link URL:
            <input
              type="url"
              value={edits.url || ''}
              onChange={(e) => setEdits(prev => ({ ...prev, url: e.target.value }))}
            />
          </label>
          <label>Display Text:
            <input
              type="text"
              value={edits.linkText || ''}
              onChange={(e) => setEdits(prev => ({ ...prev, linkText: e.target.value }))}
            />
          </label>
        </div>
      )}

      <div className="color-controls">
        <button onClick={() => setShowColorPicker('color')}>Text Color</button>
        <button onClick={() => setShowColorPicker('backgroundColor')}>Background</button>
        
        {showColorPicker && (
          <ChromePicker
            color={edits[showColorPicker] || '#000000'}
            onChangeComplete={(color) => handleStyleChange(showColorPicker, color.hex)}
            onChange={(color) => handleStyleChange(showColorPicker, color.hex)}
          />
        )}
      </div>

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default ElementEditor;