import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TestAPI = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);

  const handleTestAPI = async () => {
    try {
      const response = await fetch('https://adkbev1.vercel.app/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }


      setResponse(data);  // ✅ Set the local response state
      // navigate('/candidate/status');
    } catch (error) {
      console.error('Fetch error:', error);
      setResponse({ error: error.message });  // Optional: show error in UI
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
        style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
      >
        Test API
      </button>
      <p style={{ marginTop: '1rem', color: '#6b7280' }}>
        {response ? `Response: ${JSON.stringify(response)}` : 'No response yet.'}
      </p>
    </div>
  );
};

export default TestAPI;