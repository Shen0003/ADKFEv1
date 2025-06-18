import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './AIInterview.css';

const INTERVIEW_QUESTIONS = [
  "Tell me about yourself and your professional background.",
  "Why are you interested in this position?",
  "What are your greatest strengths?",
  "Describe a challenging project you've worked on.",
  "Where do you see yourself in 5 years?"
];

export default function AIInterview({ application, onInterviewComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [cameraReady, setCameraReady] = useState(false);
  const { dispatch } = useApp();
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let timer;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      stopRecording();
    }
    return () => clearInterval(timer);
  }, [isRecording, timeLeft]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    setIsRecording(true);
    setTimeLeft(120);
    
    mediaRecorderRef.current = new MediaRecorder(streamRef.current);
    const chunks = [];
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      chunks.push(event.data);
    };
    
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const response = {
        question: INTERVIEW_QUESTIONS[currentQuestion],
        questionNumber: currentQuestion + 1,
        recordingBlob: blob,
        timestamp: new Date().toISOString()
      };
      setResponses(prev => [...prev, response]);
    };
    
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(120);
    } else {
      completeInterview();
    }
  };

  const completeInterview = () => {
    // Update application status
    dispatch({
      type: 'UPDATE_APPLICATION_STATUS',
      payload: {
        id: application.id,
        updates: {
          interviewCompleted: true,
          status: 'interviewed'
        }
      }
    });

    // Save interview data
    dispatch({
      type: 'ADD_INTERVIEW',
      payload: {
        applicationId: application.id,
        candidateName: application.candidateName,
        jobTitle: application.jobTitle,
        responses: responses.length,
        status: 'completed'
      }
    });

    onInterviewComplete();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!cameraReady) {
    return (
      <div className="ai-interview">
        <div className="interview-loading">
          <div className="loading-spinner"></div>
          <h3>Setting up your camera...</h3>
          <p>Please allow camera and microphone access to continue with the interview.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-interview">
      <div className="interview-header">
        <h3>AI Interview - Question {currentQuestion + 1} of {INTERVIEW_QUESTIONS.length}</h3>
        <div className="interview-progress">
          <div 
            className="progress-bar" 
            style={{width: `${((currentQuestion + 1) / INTERVIEW_QUESTIONS.length) * 100}%`}}
          ></div>
        </div>
      </div>

      <div className="interview-content">
        <div className="video-section">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="candidate-video"
          />
          <div className="video-controls">
            {isRecording && (
              <div className="recording-indicator">
                <span className="rec-dot"></span>
                Recording - {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </div>

        <div className="question-section">
          <div className="question-card">
            <h4>Question {currentQuestion + 1}:</h4>
            <p>{INTERVIEW_QUESTIONS[currentQuestion]}</p>
          </div>

          <div className="interview-controls">
            {!isRecording ? (
              <button 
                className="start-recording-btn" 
                onClick={startRecording}
              >
                Start Recording Response
              </button>
            ) : (
              <div className="recording-controls">
                <button 
                  className="stop-recording-btn" 
                  onClick={stopRecording}
                >
                  Stop Recording
                </button>
                <div className="time-remaining">
                  Time remaining: {formatTime(timeLeft)}
                </div>
              </div>
            )}

            {responses.length === currentQuestion + 1 && !isRecording && (
              <button 
                className="next-question-btn" 
                onClick={nextQuestion}
              >
                {currentQuestion === INTERVIEW_QUESTIONS.length - 1 
                  ? 'Complete Interview' 
                  : 'Next Question'
                }
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="interview-tips">
        <h5>Interview Tips:</h5>
        <ul>
          <li>Look directly at the camera when speaking</li>
          <li>Speak clearly and at a normal pace</li>
          <li>You have 2 minutes per question</li>
          <li>Take your time to think before answering</li>
        </ul>
      </div>
    </div>
  );
}