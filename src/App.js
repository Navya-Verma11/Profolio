import { useReducer, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAuthenticationStatus, useSignOut, useUserData } from '@nhost/react';
import nhost from './nhost';

import Auth from './components/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import Canvas from './components/Canvas';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import './style.css';

const initialState = {
  elements: [],
  background: '#ffffff',
  projectId: null
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
      return { ...action.payload, projectId: action.projectId };
    case 'RESET':
      return { ...initialState, projectId: state.projectId };
    default:
      return state;
  }
}

const Editor = () => {
  const { projectId } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedElement, setSelectedElement] = useState(null);
  const { signOut } = useSignOut();
  const user = useUserData();

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user || !projectId) return;

      try {
        const { data, error } = await nhost.graphql.request(`
          query {
            portfolios_by_pk(id: "${projectId}") {
              json_url
            }
          }
        `);

        if (error) throw error;
        if (!data.portfolios_by_pk) return;

        const response = await fetch(data.portfolios_by_pk.json_url);
        const portfolioData = await response.json();
        dispatch({ 
          type: 'LOAD_PORTFOLIO', 
          payload: portfolioData,
          projectId: projectId
        });

      } catch (err) {
        console.error("Error loading portfolio:", err);
      }
    };

    fetchPortfolio();
  }, [user, projectId]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <Header 
          state={state}
          dispatch={dispatch}
          onReset={() => dispatch({ type: 'RESET' })}
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
      </div>
    </DndProvider>
  );
};

function App() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
        <Route path="/editor/:projectId?" element={isAuthenticated ? <Editor /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;