import { useReducer, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
        pages: state.pages.map(page => ({
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

    // Add to reducer cases
case 'DELETE_PAGE':
  return {
    ...state,
    pages: state.pages.filter((_, index) => index !== action.payload),
    currentPage: state.currentPage >= action.payload ? 
      Math.max(0, state.currentPage - 1) : 
      state.currentPage
  };

    // Add new case to reducer
case 'REMOVE_PAGE':
  return {
    ...state,
    pages: state.pages.filter((_, index) => index !== action.payload),
    currentPage: Math.min(state.currentPage, state.pages.length - 2)
  };

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
  const { pages, currentPage } = state;

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
            elements={pages[currentPage].elements}
            background={pages[currentPage].background}
            dispatch={dispatch}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            pages={pages}
            currentPage={currentPage}
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