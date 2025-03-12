import { useReducer, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAuthenticationStatus, useSignOut, useUserData } from '@nhost/react';
import nhost from './nhost';
import { useNhostClient } from '@nhost/react';

import Auth from './components/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import Canvas from './components/Canvas';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import './style.css';

const initialState = {
  pages: [{
    elements: [],
    background: '#ffffff'
  }],
  currentPage: 0
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ELEMENT':
      return {
        ...state,
        pages: state.pages.map((page, index) => 
          index === state.currentPage ? {
            ...page,
            elements: [...page.elements, action.payload]
          } : page
        )
      };
      
    case 'UPDATE_ELEMENT':
      return {
        ...state,
        pages: state.pages.map((page) => ({
          ...page,
          elements: page.elements.map(el => 
            el.id === action.payload.id ? { ...el, ...action.payload } : el
          )
        }))
      };

    case 'REMOVE_ELEMENT':
      return {
        ...state,
        pages: state.pages.map(page => ({
          ...page,
          elements: page.elements.filter(el => el.id !== action.payload)
        }))
      };

    case 'SET_BACKGROUND':
      return {
        ...state,
        pages: state.pages.map((page, index) => 
          index === state.currentPage ? {
            ...page,
            background: action.payload
          } : page
        )
      };

    case 'ADD_PAGE':
      return {
        ...state,
        pages: [...state.pages, { elements: [], background: '#ffffff' }],
        currentPage: state.pages.length
      };

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload
      };

    case 'REMOVE_PAGE':
      if (state.pages.length <= 1) return state;
      
      return {
        ...state,
        pages: state.pages.filter((_, index) => index !== action.payload),
        currentPage: action.payload >= state.pages.length - 1 
          ? state.pages.length - 2 
          : state.currentPage
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}


const Editor = () => {
  const { projectId } = useParams(); // ✅ Get project ID from URL
  const nhost = useNhostClient();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedElement, setSelectedElement] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return; // If no projectId → New project mode

      try {
        const query = `
          query GetPortfolio($id: uuid!) {
            portfolios_by_pk(id: $id) {
              data
              background
            }
          }
        `;

        const { data, error } = await nhost.graphql.request(query, { id: projectId });

        if (error) throw error;

        if (data.portfolios_by_pk) {
          console.log('Loaded project:', data.portfolios_by_pk);

          dispatch({
            type: 'RESET'
          });

          dispatch({
            type: 'SET_CURRENT_PAGE',
            payload: 0
          });

          dispatch({
            type: 'SET_BACKGROUND',
            payload: data.portfolios_by_pk.background
          });

          data.portfolios_by_pk.data.forEach(element => {
            dispatch({
              type: 'ADD_ELEMENT',
              payload: element
            });
          });
        }
      } catch (err) {
        console.error('Error loading project:', err);
      }
    };

    loadProject();
  }, [projectId, nhost]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <Header 
          state={state}
          dispatch={dispatch}
          onReset={() => dispatch({ type: 'RESET' })}
        />
        <div className="main-content">
          <LeftSidebar 
            dispatch={dispatch} 
            currentPage={state.currentPage}
          />
          <Canvas 
            elements={state.pages[state.currentPage].elements}
            background={state.pages[state.currentPage].background}
            dispatch={dispatch}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            pages={state.pages}
            currentPage={state.currentPage}
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