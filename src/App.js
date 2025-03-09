import { useReducer, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAuthenticationStatus, useSignOut, useUserData } from '@nhost/react';
import nhost from './nhost'; // Ensure nhost is correctly imported

import Auth from './components/Auth';
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
    case 'LOAD_PORTFOLIO':
      return action.payload;
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const Editor = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedElement, setSelectedElement] = useState(null);
  const { signOut } = useSignOut();
  const user = useUserData();

  // Load user's last saved portfolio
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) return;

      try {
        const { data, error } = await nhost.graphql.request(`
          query {
            portfolios(where: { user_id: { _eq: "${user.id}" } }, order_by: { created_at: desc }, limit: 1) {
              json_url
            }
          }
        `);

        if (error) throw new Error(error.message);
        if (data.portfolios.length === 0) return;

        // Fetch the JSON file from storage
        const response = await fetch(data.portfolios[0].json_url);
        const portfolioData = await response.json();
        dispatch({ type: 'LOAD_PORTFOLIO', payload: portfolioData });

      } catch (err) {
        console.error("Error loading portfolio:", err);
      }
    };

    fetchPortfolio();
  }, [user]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <Header 
          onReset={() => dispatch({ type: 'RESET' })} 
          elements={state.elements}
          background={state.background}
        />
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
        <button onClick={signOut} className="logout-btn">Logout</button>
      </div>
    </DndProvider>
  );
};

function App() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  if (isLoading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/editor" /> : <Auth />} />
        <Route 
          path="/editor" 
          element={isAuthenticated ? <Editor /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
