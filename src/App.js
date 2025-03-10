import { useReducer, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAuthenticationStatus, useSignOut, useUserData } from '@nhost/react';
import { gql } from 'graphql-request';
import nhost from './nhost';

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

const SAVE_PORTFOLIO = gql`
  mutation SavePortfolio($userId: uuid!, $data: jsonb!, $background: String!) {
    insert_portfolios_one(object: { user_id: $userId, data: $data, background: $background }) {
      id
    }
  }
`;

const Editor = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
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
              data
              background
            }
          }
        `);

        if (error) throw new Error(error.message);
        if (data.portfolios.length === 0) return;

        dispatch({ type: 'LOAD_PORTFOLIO', payload: data.portfolios[0] });
      } catch (err) {
        console.error("Error loading portfolio:", err);
      }
    };

    fetchPortfolio();
  }, [user]);

  // Function to save portfolio
  const handleSave = async () => {
    if (!user) {
      alert('You need to be logged in to save your portfolio.');
      return;
    }

    setIsSaving(true);

    try {
      const { data, error } = await nhost.graphql.request(SAVE_PORTFOLIO, {
        userId: user.id,
        data: state.elements,
        background: state.background
      });

      if (error) throw error;

      alert('Portfolio saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save portfolio.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <Header 
          onReset={() => dispatch({ type: 'RESET' })} 
          onSave={handleSave}
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
