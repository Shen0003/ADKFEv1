import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import './JobSelection.css';

export default function JobSelection({ onJobSelect }) {
  const { state } = useApp();
  
  const activeJobs = state.jobs.filter(job => job.status === 'active');
  const userApplications = state.applications.filter(app => app.candidateName === state.user.name);

  const hasApplied = (jobId) => {
    // User cannot apply again if status is pending, approved, or interviewed
    return userApplications.some(app => app.jobId === jobId && ['pending', 'approved', 'interviewed'].includes(app.status));
  };

  return (
    <div className="job-selection">
      <div className="section-header">
        <h3>Available Positions</h3>
        <p>Select a job that matches your skills and interests</p>
      </div>
      
      <div className="jobs-grid">
        {activeJobs.map(job => {
          const alreadyApplied = hasApplied(job.id);
          return (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h4>{job.title}</h4>
                <span className="job-type">{job.type}</span>
              </div>
              
              <div className="job-details">
                <div className="job-company">{job.company}</div>
                <div className="job-location">{job.location}</div>
              </div>
              
              <div className="job-description">
                <p>{job.description}</p>
              </div>
              
              <div className="job-requirements">
                <h5>Requirements:</h5>
                <div className="requirements-list">
                  {job.requirements.map((req, index) => (
                    <span key={index} className="requirement-tag">{req}</span>
                  ))}
                </div>
              </div>
              {alreadyApplied ? (
                <div className="already-applied-message">
                  <p style={{ color: '#f59e42', fontWeight: 500 }}>
                    You have already applied for this position.<br />
                    Please check your <Link to="/application-status">Application Status</Link>.
                  </p>
                  <button className="apply-btn" disabled>Already Applied</button>
                </div>
              ) : (
                <button 
                  className="apply-btn"
                  onClick={() => onJobSelect(job)}
                >
                  Apply for this position
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}