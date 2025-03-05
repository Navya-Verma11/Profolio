import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import ElementEditor from './components/ElementEditor';
import ThemeSelector from './components/ThemeSelector';
import Auth from './components/Auth'; // Import the authentication page
import './style.css';

function Editor() {
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/" element={<Auth />} /> {/* Redirect to auth by default */}
      </Routes>
    </Router>
  );
}

export default App;
