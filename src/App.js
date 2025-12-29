/* 
  Main App Component
  This is the heart of our application.
  It handles routing (navigation between pages) and user authentication state.
*/

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Import pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CreateIssue from './pages/CreateIssue';

// Import Firebase setup
import './firebase';
import './styles.css';

function App() {
  // State to track if user is logged in
  const [user, setUser] = useState(null);
  
  // State to track if we're still checking authentication
  const [loading, setLoading] = useState(true);

  // This runs once when the component loads
  // It checks if a user is already logged in
  useEffect(() => {
    const auth = getAuth();
    
    // Listen for authentication changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup function - stops listening when component unmounts
    return unsubscribe;
  }, []);

  // While checking authentication, show loading message
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  // Protected route - only show if user is logged in
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="app-header">
          <h1>Smart Issue Board</h1>
          {user && <p className="user-info">Logged in as: {user.email}</p>}
        </div>
        
        <Routes>
          {/* Public Routes - Anyone can access */}
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
          <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
          
          {/* Protected Routes - Only logged-in users can access */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-issue" 
            element={
              <ProtectedRoute>
                <CreateIssue user={user} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
