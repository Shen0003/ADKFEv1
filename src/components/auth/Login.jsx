import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Login.css';

export default function Login() {
  const [role, setRole] = useState('candidate');
  const [name, setName] = useState('');
  const { dispatch } = useApp();

  const handleLogin = (e) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch({
        type: 'SET_USER',
        payload: { name: name.trim(), role }
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to RecruitPro</h2>
        <p>Please select your role and enter your name to continue</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Select Role:</label>
            <div className="role-options">
              <label className="role-option">
                <input
                  type="radio"
                  value="candidate"
                  checked={role === 'candidate'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>Candidate</span>
              </label>
              <label className="role-option">
                <input
                  type="radio"
                  value="hr"
                  checked={role === 'hr'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>HR Admin</span>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <button type="submit" className="login-btn">
            Continue as {role === 'candidate' ? 'Candidate' : 'HR Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}