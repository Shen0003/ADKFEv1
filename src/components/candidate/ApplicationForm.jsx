import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './ApplicationForm.css';

export default function ApplicationForm({ job, onApplicationSubmit, onBack }) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    experience: '',
    coverLetter: '',
    resume: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      resume: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const application = {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      candidateName: state.user.name,
      ...formData,
      resumeFileName: formData.resume?.name || 'No file uploaded'
    };

    dispatch({
      type: 'ADD_APPLICATION',
      payload: application
    });

    onApplicationSubmit(application.id);
  };

  return (
    <div className="application-form">
      <div className="form-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Jobs
        </button>
        <div className="job-info">
          <h3>Apply for {job.title}</h3>
          <p>{job.company} • {job.location}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-section">
          <h4>Contact Information</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Professional Information</h4>
          
          <div className="form-group">
            <label htmlFor="experience">Years of Experience *</label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
            >
              <option value="">Select experience level</option>
              <option value="0-1">0-1 years</option>
              <option value="2-3">2-3 years</option>
              <option value="4-5">4-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="resume">Resume/CV *</label>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              required
            />
            <small>Please upload your resume in PDF, DOC, or DOCX format</small>
          </div>
        </div>

        <div className="form-section">
          <h4>Cover Letter</h4>
          
          <div className="form-group">
            <label htmlFor="coverLetter">Why are you interested in this position? *</label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows="6"
              placeholder="Tell us why you're a great fit for this role..."
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}