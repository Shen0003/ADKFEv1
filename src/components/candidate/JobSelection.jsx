import { useApp } from '../../context/AppContext';
import './JobSelection.css';

export default function JobSelection({ onJobSelect }) {
  const { state } = useApp();
  
  const activeJobs = state.jobs.filter(job => job.status === 'active');

  return (
    <div className="job-selection">
      <div className="section-header">
        <h3>Available Positions</h3>
        <p>Select a job that matches your skills and interests</p>
      </div>
      
      <div className="jobs-grid">
        {activeJobs.map(job => (
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
            
            <button 
              className="apply-btn"
              onClick={() => onJobSelect(job)}
            >
              Apply for this position
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}