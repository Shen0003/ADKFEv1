import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  jobs: [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'We are looking for a skilled Frontend Developer to join our team.',
      requirements: ['React', 'JavaScript', 'CSS', 'HTML'],
      status: 'active'
    },
    {
      id: 2,
      title: 'Backend Developer',
      company: 'DataSoft',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'Seeking an experienced Backend Developer for server-side development.',
      requirements: ['Node.js', 'Python', 'Database', 'API Development'],
      status: 'active'
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      type: 'Full-time',
      description: 'Join our startup as a Full Stack Developer and help build innovative solutions.',
      requirements: ['React', 'Node.js', 'MongoDB', 'Express'],
      status: 'active'
    }
  ],
  applications: [],
  interviews: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'ADD_APPLICATION':
      return { 
        ...state, 
        applications: [...state.applications, { 
          ...action.payload, 
          id: Date.now(),
          status: 'pending',
          aiInterviewEligible: false,
          interviewCompleted: false,
          submittedAt: new Date().toISOString()
        }]
      };
    case 'UPDATE_APPLICATION_STATUS':
      return {
        ...state,
        applications: state.applications.map(app =>
          app.id === action.payload.id
            ? { ...app, ...action.payload.updates }
            : app
        )
      };
    case 'ADD_INTERVIEW':
      return {
        ...state,
        interviews: [...state.interviews, {
          ...action.payload,
          id: Date.now(),
          completedAt: new Date().toISOString()
        }]
      };
    case 'ADD_JOB':
      return {
        ...state,
        jobs: [...state.jobs, {
          ...action.payload,
          id: Date.now(),
          status: 'active'
        }]
      };
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job =>
          job.id === action.payload.id
            ? { ...job, ...action.payload.updates }
            : job
        )
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}