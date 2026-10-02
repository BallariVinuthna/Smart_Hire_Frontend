import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import RecruiterLayout from './layouts/RecruiterLayout';
import PlacementLayout from './layouts/PlacementLayout';
import AdminLayout from './layouts/AdminLayout';

// Public & Landing
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicPassport from './pages/PublicPassport';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import CareerDNA from './pages/student/CareerDNA';
import JobTwin from './pages/student/JobTwin';
import ReadinessView from './pages/student/ReadinessView';
import WhatIfSimulator from './pages/student/WhatIfSimulator';
import ResumeManager from './pages/student/ResumeManager';
import ResumeBuilder from './pages/student/ResumeBuilder';
import ATSAnalysis from './pages/student/ATSAnalysis';
import ResumeTruthChecker from './pages/student/ResumeTruthChecker';
import GitHubAnalysis from './pages/student/GitHubAnalysis';
import AdaptiveAssessments from './pages/student/AdaptiveAssessments';
import AIInterviewSimulator from './pages/student/AIInterviewSimulator';
import CareerRoadmap from './pages/student/CareerRoadmap';
import DailyMissions from './pages/student/DailyMissions';
import JobSearch from './pages/student/JobSearch';
import ApplicationTracker from './pages/student/ApplicationTracker';
import CareerPassportView from './pages/student/CareerPassportView';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterJobs from './pages/recruiter/RecruiterJobs';
import CandidateIntelligence from './pages/recruiter/CandidateIntelligence';
import AIRecruitmentAssistant from './pages/recruiter/AIRecruitmentAssistant';

// Placement Pages
import PlacementDashboard from './pages/placement/PlacementDashboard';
import PlacementDrives from './pages/placement/PlacementDrives';
import PlacementStudents from './pages/placement/PlacementStudents';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/passport/:id" element={<PublicPassport />} />

          {/* Student Portal */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="career-dna" element={<CareerDNA />} />
            <Route path="job-twin" element={<JobTwin />} />
            <Route path="readiness" element={<ReadinessView />} />
            <Route path="what-if" element={<WhatIfSimulator />} />
            <Route path="resumes" element={<ResumeManager />} />
            <Route path="resume-builder" element={<ResumeBuilder />} />
            <Route path="ats" element={<ATSAnalysis />} />
            <Route path="evidence" element={<ResumeTruthChecker />} />
            <Route path="github" element={<GitHubAnalysis />} />
            <Route path="assessments" element={<AdaptiveAssessments />} />
            <Route path="interviews" element={<AIInterviewSimulator />} />
            <Route path="roadmap" element={<CareerRoadmap />} />
            <Route path="missions" element={<DailyMissions />} />
            <Route path="jobs" element={<JobSearch />} />
            <Route path="applications" element={<ApplicationTracker />} />
            <Route path="career-passport" element={<CareerPassportView />} />
          </Route>

          {/* Recruiter Portal */}
          <Route path="/recruiter" element={<RecruiterLayout />}>
            <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="jobs" element={<RecruiterJobs />} />
            <Route path="candidates" element={<CandidateIntelligence />} />
            <Route path="ai-assistant" element={<AIRecruitmentAssistant />} />
          </Route>

          {/* Placement Officer Portal */}
          <Route path="/placement" element={<PlacementLayout />}>
            <Route index element={<Navigate to="/placement/dashboard" replace />} />
            <Route path="dashboard" element={<PlacementDashboard />} />
            <Route path="drives" element={<PlacementDrives />} />
            <Route path="students" element={<PlacementStudents />} />
          </Route>

          {/* Admin Portal */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
