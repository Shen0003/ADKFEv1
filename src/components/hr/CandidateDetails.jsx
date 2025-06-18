import { useApp } from '../../context/AppContext';
import './CandidateDetails.css';

export default function CandidateDetails({ candidate, onBack }) {
  const { dispatch } = useApp();

  const handleStatusChange = (newStatus) => {
    const updates = { status: newStatus };
    
    if (newStatus === 'approved') {
      updates.aiInterviewEligible = true;
    }
    
    dispatch({
      type: 'UPDATE_APPLICATION_STATUS',
      payload: { id: candidate.id, updates }
    });
  };

  return (
    <div className="candidate-details">
      <div className="details-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Applications
        </button>
        <h3>Candidate Details</h3>
      </div>

      <div className="details-content">
        <div className="candidate-summary">
          <div className="summary-card">
            <h4>Personal Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <span>{candidate.candidateName}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{candidate.email}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{candidate.phone}</span>
              </div>
              <div className="info-item">
                <label>Experience:</label>
                <span>{candidate.experience} years</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <h4>Application Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <label>Position:</label>
                <span>{candidate.jobTitle}</span>
              </div>
              <div className="info-item">
                <label>Company:</label>
                <span>{candidate.company}</span>
              </div>
              <div className="info-item">
                <label>Applied Date:</label>
                <span>{new Date(candidate.submittedAt).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <label>Status:</label>
                <span className={`status-badge ${candidate.status}`}>
                  {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="application-details">
          <div className="details-card">
            <h4>Cover Letter</h4>
            <div className="cover-letter">
              <p>{candidate.coverLetter}</p>
            </div>
          </div>

          <div className="details-card">
            <h4>Resume</h4>
            <div className="resume-info">
              <div className="file-info">
                <span className="file-icon">📄</span>
                <span className="file-name">{candidate.resumeFileName}</span>
              </div>
              <button className="download-btn">
                Download Resume
              </button>
            </div>
          </div>

          <div className="details-card">
            <h4>Interview Status</h4>
            <div className="interview-status">
              {candidate.interviewCompleted ? (
                <div className="status-completed">
                  <span className="status-icon">✅</span>
                  <div>
                    <div className="status-text">Interview Completed</div>
                    <div className="status-subtext">
                      Candidate has successfully completed the AI interview
                    </div>
                  </div>
                </div>
              ) : candidate.aiInterviewEligible ? (
                <div className="status-eligible">
                  <span className="status-icon">🎯</span>
                  <div>
                    <div className="status-text">Interview Ready</div>
                    <div className="status-subtext">
                      Candidate is eligible and can start the AI interview
                    </div>
                  </div>
                </div>
              ) : (
                <div className="status-pending">
                  <span className="status-icon">⏳</span>
                  <div>
                    <div className="status-text">Awaiting Approval</div>
                    <div className="status-subtext">
                      Interview eligibility pending HR decision
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {candidate.status === 'pending' && (
        <div className="action-buttons">
          <button
            className="approve-btn"
            onClick={() => handleStatusChange('approved')}
          >
            Approve for Interview
          </button>
          <button
            className="reject-btn"
            onClick={() => handleStatusChange('rejected')}
          >
            Reject Application
          </button>
        </div>
      )}
    </div>
  );
}