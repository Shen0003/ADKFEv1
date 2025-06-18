import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ApplicationsList from './ApplicationsList';
import JobManagement from './JobManagement';
import CandidateDetails from './CandidateDetails';
import './HRDashboard.css';

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState('applications');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { state } = useApp();

  const stats = {
    totalApplications: state.applications.length,
    pendingReview: state.applications.filter(app => app.status === 'pending').length,
    interviewsScheduled: state.applications.filter(app => app.aiInterviewEligible && !app.interviewCompleted).length,
    interviewsCompleted: state.applications.filter(app => app.interviewCompleted).length
  };

  const tabs = [
    { id: 'applications', label: 'Applications', icon: '📄' },
    { id: 'jobs', label: 'Job Management', icon: '💼' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  const renderTabContent = () => {
    if (selectedCandidate) {
      return (
        <CandidateDetails
          candidate={selectedCandidate}
          onBack={() => setSelectedCandidate(null)}
        />
      );
    }

    switch (activeTab) {
      case 'applications':
        return (
          <ApplicationsList
            onViewCandidate={(candidate) => setSelectedCandidate(candidate)}
          />
        );
      case 'jobs':
        return <JobManagement />;
      case 'analytics':
        return <AnalyticsView stats={stats} />;
      default:
        return null;
    }
  };

  return (
    <div className="hr-dashboard">
      <div className="dashboard-header">
        <h2>HR Admin Dashboard</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalApplications}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.pendingReview}</div>
            <div className="stat-label">Pending Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.interviewsScheduled}</div>
            <div className="stat-label">Interviews Scheduled</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.interviewsCompleted}</div>
            <div className="stat-label">Interviews Completed</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedCandidate(null);
              }}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

function AnalyticsView({ stats }) {
  return (
    <div className="analytics-view">
      <h3>Recruitment Analytics</h3>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h4>Application Status Distribution</h4>
          <div className="chart-placeholder">
            <div className="bar-chart">
              <div className="bar" style={{height: `${(stats.pendingReview / stats.totalApplications) * 100}%`}}>
                <span>Pending</span>
              </div>
              <div className="bar" style={{height: `${(stats.interviewsScheduled / stats.totalApplications) * 100}%`}}>
                <span>Scheduled</span>
              </div>
              <div className="bar" style={{height: `${(stats.interviewsCompleted / stats.totalApplications) * 100}%`}}>
                <span>Completed</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="analytics-card">
          <h4>Recent Activity</h4>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">2 hours ago</span>
              <span className="activity-text">New application received</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">5 hours ago</span>
              <span className="activity-text">Interview completed</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">1 day ago</span>
              <span className="activity-text">Application approved for interview</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}