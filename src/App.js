import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import ElementEditor from './components/ElementEditor'; // Add this line
import ThemeSelector from './components/ThemeSelector';
import './style.css';

function App() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [theme, setTheme] = useState({
    primaryColor: '#3498db',
    backgroundImage: null
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <Sidebar setElements={setElements} />
        
        <Canvas 
          elements={elements}
          setElements={setElements}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          theme={theme}
        />
        
        <div className="right-panel">
          <ThemeSelector theme={theme} setTheme={setTheme} />
          <ElementEditor
            selectedElement={selectedElement}
            setElements={setElements}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;