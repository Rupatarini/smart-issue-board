/*
  Login Page
  This page allows users to sign in with email and password.
*/

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hook to navigate to other pages after login
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Firebase function to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      
      // If successful, redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Show error message if login fails
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Log In</h2>
      
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="auth-footer">
        Forgot your password? <Link to="/forgot-password">Reset it here</Link>
      </p>

      <div className="auth-divider">or</div>

      <p className="auth-footer">
        Don't have an account? <Link to="/signup">Create one here</Link>
      </p>
    </div>
  );
}

export default Login;
