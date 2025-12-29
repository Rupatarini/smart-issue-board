/*
  Forgot Password Page
  This page allows users to reset their password by sending a reset email.
  Firebase handles the password reset via email.
*/

import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPassword() {
  // State for email input
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Hook to navigate to other pages
  const navigate = useNavigate();

  // Handle password reset request
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Firebase function to send password reset email
      await sendPasswordResetEmail(auth, email);
      
      // Show success message
      setSuccess('Password reset email sent! Check your inbox to reset your password.');
      
      // Clear the form
      setEmail('');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      // Show error message if reset fails
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <p className="auth-subtitle">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <form onSubmit={handleResetPassword}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Sending reset email...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="auth-divider">or</div>

      <p className="auth-footer">
        Remember your password? <Link to="/">Log In</Link>
      </p>
      <p className="auth-footer">
        Don't have an account? <Link to="/signup">Create one here</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
