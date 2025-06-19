import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import JobSelection from './JobSelection';
import ApplicationForm from './ApplicationForm';
import AIInterview from './AIInterview';
import StatusDisplay from './StatusDisplay';
import './CandidateFlow.css';

export default function CandidateFlow() {
  const [currentStep, setCurrentStep] = useState('jobs');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const { state } = useApp();

  const userApplication = state.applications.find(app => 
    app.candidateName === state.user.name && app.jobId === selectedJob?.id
  );

  const getStepNumber = () => {
    switch (currentStep) {
      case 'jobs': return 1;
      case 'application': return 2;
      case 'status': return 3;
      default: return 1;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'jobs':
        return (
          <JobSelection
            onJobSelect={(job) => {
              setSelectedJob(job);
              setCurrentStep('application');
            }}
          />
        );
      case 'application':
        return (
          <ApplicationForm
            job={selectedJob}
            onApplicationSubmit={(appId) => {
              setApplicationId(appId);
              setCurrentStep('status');
            }}
            onBack={() => setCurrentStep('jobs')}
          />
        );
      case 'status':
        // Only allow interview if eligible
        return (
          <StatusDisplay
            application={userApplication}
            onStartInterview={() => setCurrentStep('interview')}
          />
        );
      case 'interview':
        return (
          <AIInterview
            application={userApplication}
            onInterviewComplete={() => setCurrentStep('status')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="candidate-flow">
      <div className="flow-header">
        <h2>Application Process</h2>
        <div className="progress-bar">
          <div className="progress-steps">
            <div className={`step ${getStepNumber() >= 1 ? 'active' : ''}`}>
              <span>1</span>
              <label>Select Job</label>
            </div>
            <div className={`step ${getStepNumber() >= 2 ? 'active' : ''}`}>
              <span>2</span>
              <label>Apply</label>
            </div>
            <div className={`step ${getStepNumber() >= 3 ? 'active' : ''}`}>
              <span>3</span>
              <label>Status</label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flow-content">
        {renderStepContent()}
      </div>
    </div>
  );
}