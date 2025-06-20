import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = "https://adkbev2.onrender.com"; // deployed FastAPI backend

const TestAPI = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [weatherResponse, setWeatherResponse] = useState(null);
  const [timeResponse, setTimeResponse] = useState(null);
  const [agentResponse, setAgentResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adkAgentResponse, setAdkAgentResponse] = useState(null);
  const [adkLoading, setAdkLoading] = useState(false);

  const handleTestAPI = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!response.ok) throw new Error('Network response was not ok');
      setResponse(data);
    } catch (error) {
      setResponse({ error: error.message });
    }
  };

  const handleWeather = async () => {
    try {
      const res = await fetch('/api/agent/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: 'New York' })
      });
      const data = await res.json();
      setWeatherResponse(data);
    } catch (error) {
      setWeatherResponse({ error: error.message });
    }
  };

  const handleTime = async () => {
    try {
      const res = await fetch('/api/agent/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: 'New York' })
      });
      const data = await res.json();
      setTimeResponse(data);
    } catch (error) {
      setTimeResponse({ error: error.message });
    }
  };

  // ✅ Ask FastAPI agent wrapper (your /ask-agent endpoint)
  const handleAskAgent = async () => {
    setLoading(true);
    setAgentResponse(null);
    try {
      const res = await fetch(`${BACKEND_URL}/ask-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'Hey whats the weather in new york today',
          session_id: 's_123',
          user_id: 'u_123'
        })
      });
      const data = await res.json();
      setAgentResponse(data);
    } catch (error) {
      setAgentResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#1f2937', marginBottom: '1rem' }}>Test API</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        Click the button below to test the API with your application data.
      </p>
      <button 
        onClick={handleTestAPI} 
        className="btn btn-primary"
        style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginRight: '1rem' }}
      >
        Test Health
      </button>
      <button
        onClick={handleWeather}
        className="btn btn-secondary"
        style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginRight: '1rem' }}
      >
        Get Weather (New York)
      </button>
      <button
        onClick={handleTime}
        className="btn btn-secondary"
        style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginRight: '1rem' }}
      >
        Get Time (New York)
      </button>
      <button
        onClick={handleAskAgent}
        className="btn btn-success"
        style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginTop: '1rem' }}
        disabled={loading}
      >
        {loading ? 'Asking Agent...' : 'Ask Agent (/ask-agent)'}
      </button>

      <p style={{ marginTop: '1rem', color: '#6b7280' }}>
        {response ? `Health Response: ${JSON.stringify(response)}` : 'No health response yet.'}
      </p>
      <p style={{ marginTop: '1rem', color: '#2563eb' }}>
        {weatherResponse ? `Weather Response: ${JSON.stringify(weatherResponse)}` : 'No weather response yet.'}
      </p>
      <p style={{ marginTop: '1rem', color: '#059669' }}>
        {timeResponse ? `Time Response: ${JSON.stringify(timeResponse)}` : 'No time response yet.'}
      </p>

      <div style={{ marginTop: '2rem', textAlign: 'left', background: '#f0fdf4', padding: '1rem', borderRadius: '8px' }}>
        <strong>Agent Response (/ask-agent):</strong>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {agentResponse ? (agentResponse.response || JSON.stringify(agentResponse, null, 2)) : 'No agent response yet.'}
        </pre>
      </div>
    </div>
  );
};

export default TestAPI;
