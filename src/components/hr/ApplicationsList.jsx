import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './ApplicationsList.css';

export default function ApplicationsList({ onViewCandidate }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const { state, dispatch } = useApp();

  const filteredApplications = state.applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.submittedAt) - new Date(a.submittedAt);
    }
    if (sortBy === 'name') {
      return a.candidateName.localeCompare(b.candidateName);
    }
    return 0;
  });

  const handleStatusChange = (applicationId, newStatus) => {
    const updates = { status: newStatus };
    
    // If approving for interview, set AI interview eligibility
    if (newStatus === 'approved') {
      updates.aiInterviewEligible = true;
    }
    
    dispatch({
      type: 'UPDATE_APPLICATION_STATUS',
      payload: { id: applicationId, updates }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'interviewed': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div className="applications-list">
      <div className="list-header">
        <h3>Applications Management</h3>
        <div className="list-controls">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="interviewed">Interviewed</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {sortedApplications.length === 0 ? (
        <div className="no-applications">
          <p>No applications found for the selected filter.</p>
        </div>
      ) : (
        <div className="applications-table">
          <div className="table-header">
            <div className="header-cell">Candidate</div>
            <div className="header-cell">Position</div>
            <div className="header-cell">Applied Date</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Actions</div>
          </div>
          
          {sortedApplications.map(application => (
            <div key={application.id} className="table-row">
              <div className="cell candidate-cell">
                <div className="candidate-info">
                  <div className="candidate-name">{application.candidateName}</div>
                  <div className="candidate-email">{application.email}</div>
                </div>
              </div>
              
              <div className="cell">
                <div className="job-info">
                  <div className="job-title">{application.jobTitle}</div>
                  <div className="company-name">{application.company}</div>
                </div>
              </div>
              
              <div className="cell">
                {new Date(application.submittedAt).toLocaleDateString()}
              </div>
              
              <div className="cell">
                <span className={`status-badge ${getStatusColor(application.status)}`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
                {application.aiInterviewEligible && (
                  <span className="interview-badge">
                    Interview Ready
                  </span>
                )}
                {application.interviewCompleted && (
                  <span className="completed-badge">
                    Interview Done
                  </span>
                )}
              </div>
              
              <div className="cell actions-cell">
                <button
                  className="view-btn"
                  onClick={() => onViewCandidate(application)}
                >
                  View Details
                </button>
                
                {application.status === 'pending' && (
                  <div className="status-actions">
                    <button
                      className="approve-btn"
                      onClick={() => handleStatusChange(application.id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleStatusChange(application.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}