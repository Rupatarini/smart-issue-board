/*
  Create Issue Page
  This page allows users to create new issues.
  It also warns about similar issues before saving.
*/

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { checkSimilarIssues } from '../utils/similarityCheck';

function CreateIssue({ user }) {
  // State for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for similar issues warning
  const [similarIssues, setSimilarIssues] = useState([]);
  const [showSimilarWarning, setShowSimilarWarning] = useState(false);
  const [forceCreate, setForceCreate] = useState(false);

  // Hook to navigate to other pages
  const navigate = useNavigate();

  // Fetch all issues when title changes to check for similarity
  const handleTitleChange = async (newTitle) => {
    setTitle(newTitle);
    setForceCreate(false); // Reset the force flag when user changes title
    
    if (newTitle.trim().length < 3) {
      setSimilarIssues([]);
      setShowSimilarWarning(false);
      return;
    }

    try {
      // Get all existing issues
      const issuesRef = collection(db, 'issues');
      const querySnapshot = await getDocs(issuesRef);
      
      const existingIssues = [];
      querySnapshot.forEach((doc) => {
        existingIssues.push(doc.data());
      });

      // Check for similar issues
      const similar = checkSimilarIssues(newTitle, existingIssues);
      setSimilarIssues(similar);
      
      if (similar.length > 0) {
        setShowSimilarWarning(true);
      } else {
        setShowSimilarWarning(false);
      }
    } catch (err) {
      console.error('Error checking similar issues:', err);
    }
  };

  // Handle form submission to create issue
  const handleCreateIssue = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!title.trim() || !description.trim() || !assignedTo.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // If similar issues exist and user hasn't confirmed, show warning
    if (similarIssues.length > 0 && !forceCreate) {
      setShowSimilarWarning(true);
      return;
    }

    setLoading(true);

    try {
      // Create new issue object
      const newIssue = {
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        status: 'Open', // Default status
        assignedTo: assignedTo.trim(),
        createdBy: user.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to Firestore
      const issuesRef = collection(db, 'issues');
      await addDoc(issuesRef, newIssue);

      // Success! Redirect to dashboard
      alert('✅ Issue created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create issue: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-issue-container">
      <h2>Create New Issue</h2>
      
      {error && <p className="error-message">{error}</p>}

      {/* Similar Issues Warning */}
      {showSimilarWarning && similarIssues.length > 0 && (
        <div className="warning-message">
          <h4>Similar Issues Found</h4>
          <p>We found {similarIssues.length} issue(s) with similar titles. Please review before creating a duplicate:</p>
          <ul>
            {similarIssues.map((issue, index) => (
              <li key={index}>{issue.title}</li>
            ))}
          </ul>
          <p>Do you want to proceed with creating a new issue?</p>
          <button 
            onClick={() => setForceCreate(true)}
            className="btn-warning"
          >
            Yes, Create Anyway
          </button>
          <button 
            onClick={() => setShowSimilarWarning(false)}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      )}

      <form onSubmit={handleCreateIssue}>
        <div className="form-group">
          <label>Issue Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g., Login button not responding to clicks"
            required
          />
          {similarIssues.length > 0 && (
            <small className="similar-count">{similarIssues.length} similar issue(s)</small>
          )}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide detailed information about the issue..."
            required
          />
        </div>

        <div className="form-group">
          <label>Priority Level</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Assign To (Email)</label>
          <input
            type="email"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="team member's email address"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || showSimilarWarning}
          className="btn-primary btn-success"
        >
          {loading ? 'Creating...' : 'Create Issue'}
        </button>
      </form>

      <p style={{ marginTop: '28px', textAlign: 'center' }}>
        <Link to="/dashboard">Back to Issues</Link>
      </p>
    </div>
  );
}

export default CreateIssue;
