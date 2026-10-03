const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.port === '5173') {
    return 'http://localhost:8080/api';
  }
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('smarthire_token');
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    // If token invalid, remove it
    localStorage.removeItem('smarthire_token');
    localStorage.removeItem('smarthire_user');
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'API Request failed');
  }
  return response.json();
};

export const api = {
  // Auth
  login: (credentials) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    }).then(handleResponse),

  register: (userData) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    }).then(handleResponse),

  getCurrentUser: () =>
    fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    }).then(handleResponse),

  // Student Profile & Data
  getStudentProfile: () =>
    fetch(`${API_BASE_URL}/student/profile`, { headers: getHeaders() }).then(handleResponse),

  updateStudentProfile: (profile) =>
    fetch(`${API_BASE_URL}/student/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profile)
    }).then(handleResponse),

  getSkills: () =>
    fetch(`${API_BASE_URL}/student/skills`, { headers: getHeaders() }).then(handleResponse),

  addSkill: (skillName, claimLevel = 80) =>
    fetch(`${API_BASE_URL}/student/skills?skillName=${encodeURIComponent(skillName)}&claimLevel=${claimLevel}`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  getProjects: () =>
    fetch(`${API_BASE_URL}/student/projects`, { headers: getHeaders() }).then(handleResponse),

  addProject: (project) =>
    fetch(`${API_BASE_URL}/student/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(project)
    }).then(handleResponse),

  deleteProject: (id) =>
    fetch(`${API_BASE_URL}/student/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }),

  getCertificates: () =>
    fetch(`${API_BASE_URL}/student/certificates`, { headers: getHeaders() }).then(handleResponse),

  getNotifications: () =>
    fetch(`${API_BASE_URL}/student/notifications`, { headers: getHeaders() }).then(handleResponse),

  markNotificationRead: (id) =>
    fetch(`${API_BASE_URL}/student/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders()
    }),

  // Career Intelligence
  getCareerDna: () =>
    fetch(`${API_BASE_URL}/intelligence/career-dna`, { headers: getHeaders() }).then(handleResponse),

  getJobTwin: (targetRole) =>
    fetch(`${API_BASE_URL}/intelligence/job-twin${targetRole ? `?targetRole=${encodeURIComponent(targetRole)}` : ''}`, {
      headers: getHeaders()
    }).then(handleResponse),

  getReadiness: () =>
    fetch(`${API_BASE_URL}/intelligence/readiness`, { headers: getHeaders() }).then(handleResponse),

  recalculateReadiness: () =>
    fetch(`${API_BASE_URL}/intelligence/readiness/recalculate`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  simulateWhatIf: (addedSkills) =>
    fetch(`${API_BASE_URL}/intelligence/what-if`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ addedSkills })
    }).then(handleResponse),

  getProofOfSkill: () =>
    fetch(`${API_BASE_URL}/intelligence/proof-of-skill`, { headers: getHeaders() }).then(handleResponse),

  // Resumes & ATS
  getResumes: () =>
    fetch(`${API_BASE_URL}/resumes`, { headers: getHeaders() }).then(handleResponse),

  getResume: (id) =>
    fetch(`${API_BASE_URL}/resumes/${id}`, { headers: getHeaders() }).then(handleResponse),

  createResume: (resumeData) =>
    fetch(`${API_BASE_URL}/resumes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(resumeData)
    }).then(handleResponse),

  updateResume: (id, resumeData) =>
    fetch(`${API_BASE_URL}/resumes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(resumeData)
    }).then(handleResponse),

  analyzeResume: (id) =>
    fetch(`${API_BASE_URL}/resumes/${id}/analyze`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  uploadResumePdf: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE_URL}/resumes/${id}/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    }).then(handleResponse);
  },

  // Assessments
  getAssessments: () =>
    fetch(`${API_BASE_URL}/assessments`, { headers: getHeaders() }).then(handleResponse),

  getAssessmentQuestions: (id) =>
    fetch(`${API_BASE_URL}/assessments/${id}/questions`, { headers: getHeaders() }).then(handleResponse),

  submitAssessment: (assessmentId, answers) =>
    fetch(`${API_BASE_URL}/assessments/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ assessmentId, answers })
    }).then(handleResponse),

  getAssessmentAttempts: () =>
    fetch(`${API_BASE_URL}/assessments/attempts`, { headers: getHeaders() }).then(handleResponse),

  // AI Interview Simulator
  startInterview: (targetRole) =>
    fetch(`${API_BASE_URL}/interviews/start`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ targetRole })
    }).then(handleResponse),

  getInterviewQuestions: (id) =>
    fetch(`${API_BASE_URL}/interviews/${id}/questions`, { headers: getHeaders() }).then(handleResponse),

  submitInterviewAnswer: (interviewId, questionId, transcript, audioUrl) =>
    fetch(`${API_BASE_URL}/interviews/${interviewId}/submit-answer`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ questionId, transcript, audioUrl })
    }).then(handleResponse),

  completeInterview: (id) =>
    fetch(`${API_BASE_URL}/interviews/${id}/complete`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  getInterviewHistory: () =>
    fetch(`${API_BASE_URL}/interviews/history`, { headers: getHeaders() }).then(handleResponse),

  // Career Roadmap
  getRoadmap: () =>
    fetch(`${API_BASE_URL}/roadmap`, { headers: getHeaders() }).then(handleResponse),

  updateRoadmapNodeStatus: (nodeId, status) =>
    fetch(`${API_BASE_URL}/roadmap/nodes/${nodeId}/status?status=${status}`, {
      method: 'PATCH',
      headers: getHeaders()
    }).then(handleResponse),

  // Daily Missions
  getDailyMissions: () =>
    fetch(`${API_BASE_URL}/missions/daily`, { headers: getHeaders() }).then(handleResponse),

  completeMission: (id) =>
    fetch(`${API_BASE_URL}/missions/${id}/complete`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  // Jobs & Applications
  getJobs: (search = '') =>
    fetch(`${API_BASE_URL}/jobs${search ? `?search=${encodeURIComponent(search)}` : ''}`, {
      headers: getHeaders()
    }).then(handleResponse),

  getJobDetails: (id) =>
    fetch(`${API_BASE_URL}/jobs/${id}`, { headers: getHeaders() }).then(handleResponse),

  preApplyCheck: (id) =>
    fetch(`${API_BASE_URL}/jobs/${id}/pre-apply-check`, { headers: getHeaders() }).then(handleResponse),

  applyToJob: (id, coverNote) =>
    fetch(`${API_BASE_URL}/jobs/${id}/apply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ jobId: id, coverNote })
    }).then(handleResponse),

  getMyApplications: () =>
    fetch(`${API_BASE_URL}/jobs/applications`, { headers: getHeaders() }).then(handleResponse),

  toggleSaveJob: (id) =>
    fetch(`${API_BASE_URL}/jobs/${id}/save`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  // Career Passport
  getMyPassport: () =>
    fetch(`${API_BASE_URL}/passport/my`, { headers: getHeaders() }).then(handleResponse),

  getPublicPassport: (passportId) =>
    fetch(`${API_BASE_URL}/passport/public/${passportId}`).then(handleResponse),

  // GitHub Integration
  getGitHubStatus: () =>
    fetch(`${API_BASE_URL}/github/status`, { headers: getHeaders() }).then(handleResponse),

  getGitHubAuthUrl: () =>
    fetch(`${API_BASE_URL}/github/auth`, { headers: getHeaders() }).then(handleResponse),

  connectGitHubCode: (code) =>
    fetch(`${API_BASE_URL}/github/callback`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code })
    }).then(handleResponse),

  connectGitHubUsername: (username) =>
    fetch(`${API_BASE_URL}/github/connect`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username })
    }).then(handleResponse),

  disconnectGitHub: () =>
    fetch(`${API_BASE_URL}/github/disconnect`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  refreshGitHubData: () =>
    fetch(`${API_BASE_URL}/github/refresh`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  getGitHubAnalytics: (username, refresh = false) =>
    fetch(`${API_BASE_URL}/github/analytics?${username ? `username=${encodeURIComponent(username)}&` : ''}${refresh ? 'refresh=true' : ''}`, {
      headers: getHeaders()
    }).then(handleResponse),

  // Recruiter
  getRecruiterMetrics: () =>
    fetch(`${API_BASE_URL}/recruiter/metrics`, { headers: getHeaders() }).then(handleResponse),

  getRecruiterJobs: () =>
    fetch(`${API_BASE_URL}/recruiter/jobs`, { headers: getHeaders() }).then(handleResponse),

  createJob: (job) =>
    fetch(`${API_BASE_URL}/recruiter/jobs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(job)
    }).then(handleResponse),

  updateApplicationStatus: (id, status) =>
    fetch(`${API_BASE_URL}/recruiter/applications/${id}/status?status=${status}`, {
      method: 'PATCH',
      headers: getHeaders()
    }).then(handleResponse),

  // Placement Officer
  getBatchStats: (batchYear = 2027) =>
    fetch(`${API_BASE_URL}/placement/batch-stats?batchYear=${batchYear}`, {
      headers: getHeaders()
    }).then(handleResponse),

  getPlacementDrives: () =>
    fetch(`${API_BASE_URL}/placement/drives`, { headers: getHeaders() }).then(handleResponse),

  registerForDrive: (driveId) =>
    fetch(`${API_BASE_URL}/placement/drives/${driveId}/register`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  getPlacementStudents: (batchYear = 2027) =>
    fetch(`${API_BASE_URL}/placement/students?batchYear=${batchYear}`, {
      headers: getHeaders()
    }).then(handleResponse),

  // Admin
  getAdminOverview: () =>
    fetch(`${API_BASE_URL}/admin/overview`, { headers: getHeaders() }).then(handleResponse),

  getAdminUsers: () =>
    fetch(`${API_BASE_URL}/admin/users`, { headers: getHeaders() }).then(handleResponse),

  // =========================================================
  // Spring AI + Gemini + RAG Recruitment Intelligence
  // =========================================================
  uploadAiDocument: (file, docType = 'RESUME') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
    return fetch(`${API_BASE_URL}/ai/documents/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    }).then(handleResponse);
  },

  getAiDocuments: () =>
    fetch(`${API_BASE_URL}/ai/documents`, { headers: getHeaders() }).then(handleResponse),

  deleteAiDocument: (id) =>
    fetch(`${API_BASE_URL}/ai/documents/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }),

  sendAiChat: (message, conversationId, documentId = null) =>
    fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message, conversationId, documentId })
    }).then(handleResponse),

  getAiConversations: () =>
    fetch(`${API_BASE_URL}/ai/conversations`, { headers: getHeaders() }).then(handleResponse),

  getAiConversationMessages: (conversationId) =>
    fetch(`${API_BASE_URL}/ai/conversations/${conversationId}/messages`, {
      headers: getHeaders()
    }).then(handleResponse),

  deleteAiConversation: (conversationId) =>
    fetch(`${API_BASE_URL}/ai/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: getHeaders()
    }),

  matchResumeToJob: (resumeDocumentId, jobDocumentId, jobDescriptionText) =>
    fetch(`${API_BASE_URL}/ai/resume/match`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ resumeDocumentId, jobDocumentId, jobDescriptionText })
    }).then(handleResponse)
};

