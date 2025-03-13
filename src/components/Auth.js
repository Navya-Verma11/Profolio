import React, { useState, useEffect } from 'react';
import { useSignInEmailPassword, useSignUpEmailPassword, useAuthenticationStatus } from '@nhost/react';
import { useNavigate } from 'react-router-dom'; 
import './Auth.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState(null);

  const { signInEmailPassword, isLoading: signingIn, error: signInError } = useSignInEmailPassword();
  const { signUpEmailPassword, isLoading: signingUp, error: signUpError } = useSignUpEmailPassword();
  const { isAuthenticated } = useAuthenticationStatus();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/editor'); 
    }
  }, [isAuthenticated, navigate]);

  const handleAuth = async () => {
    setMessage(null);

    if (isSignUp) {
      const { error } = await signUpEmailPassword(email, password);
      if (!error) {
        setMessage(`A verification email has been sent to ${email}. Please check your inbox.`);
      }
    } else {
      await signInEmailPassword(email, password);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isSignUp ? 'Create an Account' : 'Welcome Back!'}</h2>
        <div className="auth-form">
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="auth-button"
            onClick={handleAuth}
            disabled={signingIn || signingUp}
          >
            {signingIn || signingUp ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        {message && <p className="success-message">{message}</p>}
        {signUpError && <p className="error-message">{signUpError.message}</p>}
        {signInError && <p className="error-message">{signInError.message}</p>}

        <p className="toggle-text">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span className="toggle-link" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
