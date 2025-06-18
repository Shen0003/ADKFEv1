import { useApp } from '../../context/AppContext';
import './Layout.css';

export default function Layout({ children }) {
  const { state, dispatch } = useApp();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">RecruitPro</h1>
          {state.user && (
            <div className="header-actions">
              <span className="user-info">
                Welcome, {state.user.name} ({state.user.role})
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}