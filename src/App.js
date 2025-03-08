import { useReducer, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Canvas from './components/Canvas';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import './style.css';

const initialState = {
  elements: [],
  background: '#ffffff'
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ELEMENT':
      return { ...state, elements: [...state.elements, action.payload] };
    case 'UPDATE_ELEMENT':
      return {
        ...state,
        elements: state.elements.map(el => 
          el.id === action.payload.id ? { ...el, ...action.payload } : el
        )
      };
    case 'REMOVE_ELEMENT':
      return {
        ...state,
        elements: state.elements.filter(el => el.id !== action.payload)
      };
    case 'SET_BACKGROUND':
      return { ...state, background: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedElement, setSelectedElement] = useState(null);

  const handleSave = () => {
    localStorage.setItem('portfolioDesign', JSON.stringify(state));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <Header onReset={() => dispatch({ type: 'RESET' })} onSave={handleSave} />
        <div className="main-content">
          <LeftSidebar dispatch={dispatch} />
          <Canvas 
            elements={state.elements} 
            background={state.background}
            dispatch={dispatch}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
          />
          <RightSidebar 
            element={selectedElement}
            dispatch={dispatch}
            setSelectedElement={setSelectedElement}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;