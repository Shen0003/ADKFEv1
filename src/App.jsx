import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/shared/Layout';
import Login from './components/auth/Login';
import CandidateFlow from './components/candidate/CandidateFlow';
import HRDashboard from './components/hr/HRDashboard';
import ApplicationStatus from './components/candidate/ApplicationStatus';
import AIInterview from './components/candidate/AIInterview';
import TestAPI from './components/candidate/TestApi';
import './App.css';

function AppContent() {
  const { state } = useApp();

  if (!state.user) {
    return <Login />;
  }

  return (
    <Layout>
      {state.user.role === 'candidate' ? (
        <CandidateFlow />
      ) : (
        <HRDashboard />
      )}
    </Layout>
  );
}

function InterviewRouteWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();
  const applicationId = location.state?.applicationId;
  const application = state.applications.find(app => app.id === applicationId);

  if (!application) {
    return <div style={{ padding: '2rem', color: 'red' }}>No application found for this interview.</div>;
  }

  return (
    <AIInterview
      application={application}
      onInterviewComplete={() => navigate('/application-status')}
    />
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/application-status" element={<Layout><ApplicationStatus /></Layout>} />
            <Route path="/interview" element={<Layout><InterviewRouteWrapper /></Layout>} />
            <Route path='/test-api' element={<Layout><TestAPI /></Layout>} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;