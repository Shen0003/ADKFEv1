import { useApp } from '../../context/AppContext';
import './StatusDisplay.css';

export default function StatusDisplay({ application, onStartInterview }) {
  const { state } = useApp();

  if (!application) {
    return (
      <div className="status-display">
        <div className="status-content">
          <div className="status-icon loading">
            ⏳
          </div>
          <h3>No Application Found</h3>
          <p>Please complete your application first.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'interviewed': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusMessage = () => {
    if (application.interviewCompleted) {
      return {
        title: 'Interview Completed',
        message: 'Thank you for completing the AI interview. We will review your responses and get back to you soon.',
        icon: '✅'
      };
    }
    
    if (application.aiInterviewEligible) {
      return {
        title: 'Interview Ready',
        message: 'Congratulations! You are eligible for the AI interview. Click the button below to start.',
        icon: '🎯',
        showInterviewButton: true
      };
    }
    
    if (application.status === 'pending') {
      return {
        title: 'Application Under Review',
        message: 'Your application has been submitted successfully. Our HR team is reviewing your profile and will determine if you qualify for the AI interview.',
        icon: '⏳'
      };
    }
    
    if (application.status === 'rejected') {
      return {
        title: 'Application Not Selected',
        message: 'Thank you for your interest. Unfortunately, we have decided not to move forward with your application at this time.',
        icon: '❌'
      };
    }
    
    return {
      title: 'Application Status Unknown',
      message: 'Please contact HR for more information about your application status.',
      icon: '❓'
    };
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="status-display">
      <div className="application-summary">
        <h3>Application Summary</h3>
        <div className="summary-details">
          <div className="detail-item">
            <label>Position:</label>
            <span>{application.jobTitle}</span>
          </div>
          <div className="detail-item">
            <label>Company:</label>
            <span>{application.company}</span>
          </div>
          <div className="detail-item">
            <label>Applied:</label>
            <span>{new Date(application.submittedAt).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <label>Status:</label>
            <span className={`status-badge ${getStatusColor(application.status)}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="status-content">
        <div className={`status-icon ${getStatusColor(application.status)}`}>
          {statusInfo.icon}
        </div>
        <h3>{statusInfo.title}</h3>
        <p>{statusInfo.message}</p>
        
        {statusInfo.showInterviewButton && (
          <button className="interview-btn" onClick={onStartInterview}>
            Start AI Interview
          </button>
        )}
      </div>

      {application.interviewCompleted && (
        <div className="interview-summary">
          <h4>Interview Details</h4>
          <p>Interview completed successfully. Your responses have been recorded and will be reviewed by our team.</p>
        </div>
      )}
    </div>
  );
}