import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/shared/Layout';
import Login from './components/auth/Login';
import CandidateFlow from './components/candidate/CandidateFlow';
import HRDashboard from './components/hr/HRDashboard';
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

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;