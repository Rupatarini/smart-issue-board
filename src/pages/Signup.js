/*
  Signup Page
  This page allows new users to create an account with email and password.
*/

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hook to navigate to other pages after signup
  const navigate = useNavigate();

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Firebase function to create a new user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      
      // If successful, redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Show error message if signup fails
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSignup}>
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

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary btn-success"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/">Log in here</Link>
      </p>
    </div>
  );
}

export default Signup;
