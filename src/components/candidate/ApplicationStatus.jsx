import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './ApplicationStatus.css';

export default function ApplicationStatus() {
  const { state } = useApp();
  const navigate = useNavigate();

  const userApplications = state.applications.filter(app => 
    app.candidateName === state.user.name
  );

  const startInterview = (application) => {
    navigate('/interview', { state: { applicationId: application.id } });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'orange', label: 'Under Review' };
      case 'approved':
        return { color: 'green', label: 'Approved' };
      case 'rejected':
        return { color: 'red', label: 'Not Selected' };
      case 'interviewed':
        return { color: 'blue', label: 'Interview Completed' };
      default:
        return { color: 'gray', label: status };
    }
  };

  return (
    <div className="application-status-page">
      <h2>My Applications Status</h2>
      {userApplications.length === 0 ? (
        <div className="no-applications">
          <p>You haven't applied to any positions yet.</p>
          <button onClick={() => navigate('/jobs')}>View Open Positions</button>
        </div>
      ) : (
        <div className="applications-grid">
          {userApplications.map(application => {
            const statusInfo = getStatusInfo(application.status);
            return (
              <div key={application.id} className="status-card">
                <div className="job-info">
                  <h3>{application.jobTitle}</h3>
                  <p className="company">{application.company}</p>
                  <p className="date">Applied: {new Date(application.submittedAt).toLocaleDateString()}</p>
                </div>
                
                <div className="status-info">
                  <span className={`status-badge ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
                
                {application.aiInterviewEligible && !application.interviewCompleted && (
                  <button 
                    className="interview-button"
                    onClick={() => startInterview(application)}
                  >
                    Start AI Interview
                  </button>
                )}
                
                {application.interviewCompleted && (
                  <div className="interview-completed">
                    <span className="check-icon">✓</span>
                    Interview Completed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}