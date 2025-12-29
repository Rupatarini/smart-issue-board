/*
  Dashboard Page
  This page shows all issues that have been created.
  Users can see, filter, and manage issues here.
*/

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard({ user }) {
  // State for storing issues
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for filters
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  // Hook to navigate to other pages
  const navigate = useNavigate();

  // Fetch issues when component loads
  useEffect(() => {
    fetchIssues();
  }, []);

  // Function to fetch all issues from Firestore
  const fetchIssues = async () => {
    try {
      setLoading(true);
      
      // Get all issues from the 'issues' collection
      const issuesRef = collection(db, 'issues');
      const querySnapshot = await getDocs(issuesRef);
      
      // Convert documents to array and sort by newest first
      const issuesList = [];
      querySnapshot.forEach((doc) => {
        issuesList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      // Sort by creation date (newest first)
      issuesList.sort((a, b) => b.createdAt - a.createdAt);
      
      setIssues(issuesList);
      setError('');
    } catch (err) {
      setError('Failed to load issues: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to update issue status
  const updateIssueStatus = async (issueId, currentStatus, newStatus) => {
    // Rule: Cannot move directly from Open to Done
    if (currentStatus === 'Open' && newStatus === 'Done') {
      alert('⚠️ Cannot move issue directly from Open to Done.\nPlease move it to "In Progress" first.');
      return;
    }

    try {
      const issueRef = doc(db, 'issues', issueId);
      await updateDoc(issueRef, {
        status: newStatus,
        updatedAt: new Date(),
      });
      
      // Refresh the issue list
      fetchIssues();
    } catch (err) {
      setError('Failed to update issue: ' + err.message);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      setError('Failed to logout: ' + err.message);
    }
  };

  // Filter issues based on status and priority
  const filteredIssues = issues.filter((issue) => {
    const statusMatch = filterStatus === 'All' || issue.status === filterStatus;
    const priorityMatch = filterPriority === 'All' || issue.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading issues...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Issues</h2>
        <div className="dashboard-buttons">
          <Link to="/create-issue">
            <button className="btn-primary">New Issue</button>
          </Link>
          <button 
            onClick={handleLogout}
            className="btn-danger"
          >
            Logout
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Filter by Priority:</label>
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <div className="empty-state">
          <h3>No issues found</h3>
          <p>Get started by creating your first issue to track and manage work.</p>
          <Link to="/create-issue">
            <button className="btn-primary">Create New Issue</button>
          </Link>
        </div>
      ) : (
        <div>
          {filteredIssues.map((issue) => (
            <div 
              key={issue.id}
              className={`issue-card ${issue.priority.toLowerCase()}`}
            >
              <h3>{issue.title}</h3>
              <p>{issue.description}</p>
              
              <div className="issue-meta">
                <span>
                  <strong>Priority</strong>
                  <span className={`issue-priority priority-${issue.priority.toLowerCase()}`}>
                    {issue.priority}
                  </span>
                </span>
                <span>
                  <strong>Status</strong>
                  <span className={`issue-status status-${issue.status.toLowerCase().replace(' ', '-')}`}>
                    {issue.status}
                  </span>
                </span>
                <span>
                  <strong>Assigned To</strong>
                  {issue.assignedTo}
                </span>
                <span>
                  <strong>Created By</strong>
                  {issue.createdBy}
                </span>
              </div>

              {/* Status update buttons */}
              <div className="issue-actions">
                <select 
                  value={issue.status}
                  onChange={(e) => updateIssueStatus(issue.id, issue.status, e.target.value)}
                >
                  <option>{issue.status}</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
