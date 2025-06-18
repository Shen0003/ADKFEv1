import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './JobManagement.css';

export default function JobManagement() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: ''
  });
  
  const { state, dispatch } = useApp();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newJob = {
      ...formData,
      requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req)
    };
    
    dispatch({
      type: 'ADD_JOB',
      payload: newJob
    });
    
    setFormData({
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      description: '',
      requirements: ''
    });
    
    setShowAddForm(false);
  };

  const handleStatusToggle = (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    dispatch({
      type: 'UPDATE_JOB',
      payload: {
        id: jobId,
        updates: { status: newStatus }
      }
    });
  };

  return (
    <div className="job-management">
      <div className="management-header">
        <h3>Job Management</h3>
        <button
          className="add-job-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add New Job'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-job-form">
          <h4>Add New Job Position</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="company">Company *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="type">Job Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="requirements">Requirements (comma-separated) *</label>
              <input
                type="text"
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="React, JavaScript, CSS, HTML"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Add Job
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="jobs-list">
        <h4>Existing Jobs ({state.jobs.length})</h4>
        {state.jobs.length === 0 ? (
          <div className="no-jobs">
            <p>No jobs posted yet. Add your first job posting above.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {state.jobs.map(job => (
              <div key={job.id} className={`job-item ${job.status}`}>
                <div className="job-header">
                  <div className="job-title-section">
                    <h5>{job.title}</h5>
                    <span className={`status-indicator ${job.status}`}>
                      {job.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>
                  <button
                    className="status-toggle"
                    onClick={() => handleStatusToggle(job.id, job.status)}
                  >
                    {job.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>

                <div className="job-details">
                  <div className="job-meta">
                    <span className="company">{job.company}</span>
                    <span className="location">{job.location}</span>
                    <span className="type">{job.type}</span>
                  </div>
                  
                  <p className="job-description">{job.description}</p>
                  
                  <div className="job-requirements">
                    <strong>Requirements:</strong>
                    <div className="requirements-tags">
                      {job.requirements.map((req, index) => (
                        <span key={index} className="requirement-tag">{req}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="application-stats">
                    Applications: {state.applications.filter(app => app.jobId === job.id).length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}