import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children }) {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const renderNavLinks = () => {
    if (!state.user) return null;

    return (
      <nav className="main-nav">
        {state.user.role === 'hr' ? (
          <button 
            className={`nav-link ${isActiveRoute('/hr-dashboard') ? 'active' : ''}`}
            onClick={() => navigate('/hr-dashboard')}
          >
            <span className="nav-icon">📊</span>
            HR Dashboard
          </button>
        ) : (
          <>
            <button 
              className={`nav-link ${isActiveRoute('/candidate-flow') ? 'active' : ''}`}
              onClick={() => navigate('/candidate-flow')}
            >
              <span className="nav-icon">🏠</span>
              Home
            </button>
            <button 
              className={`nav-link ${isActiveRoute('/application-status') ? 'active' : ''}`}
              onClick={() => navigate('/application-status')}
            >
              {/* <span className="nav-icon">📝</span> */}
              Applications
            </button>
            <button 
              className={`nav-link ${isActiveRoute('/test-api') ? 'active' : ''}`}
              onClick={() => navigate('/test-api')}
            >
              TestApi
            </button>
          </>
        )}
      </nav>
    );
  };

  return (
    <div className="layout">
      {state.user && (
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <h1 
                className="logo" 
                onClick={() => navigate(state.user.role === 'hr' ? '/hr-dashboard' : '/candidate-flow')}
                role="button"
              >
                RecruitPro
              </h1>
              {renderNavLinks()}
            </div>
            <div className="header-actions">
              <div className="user-info">
                <span className="user-role">{state.user.role.toUpperCase()}</span>
                <span className="user-name">{state.user.name}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                {/* <span className="logout-icon">🚪</span> */}
                Logout
              </button>
            </div>
          </div>
        </header>
      )}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}