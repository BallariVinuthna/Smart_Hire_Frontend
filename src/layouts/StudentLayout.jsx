import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  LayoutDashboard, Dna, Target, Gauge, SlidersHorizontal,
  FileText, CheckCircle2, GitBranch, HelpCircle, Mic,
  Compass, Flame, Briefcase, Send, QrCode, Sparkles
} from 'lucide-react';

export default function StudentLayout() {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', to: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Career DNA', to: '/student/career-dna', icon: Dna },
    { label: 'Job Twin', to: '/student/job-twin', icon: Target },
    { label: 'Readiness', to: '/student/readiness', icon: Gauge },
    { label: 'What-If', to: '/student/what-if', icon: SlidersHorizontal },
    { label: 'Resumes', to: '/student/resumes', icon: FileText },
    { label: 'ATS Analysis', to: '/student/ats', icon: Sparkles },
    { label: 'Truth Checker', to: '/student/evidence', icon: CheckCircle2 },
    { label: 'GitHub', to: '/student/github', icon: GitBranch },
    { label: 'Assessments', to: '/student/assessments', icon: HelpCircle },
    { label: 'AI Interview', to: '/student/interviews', icon: Mic },
    { label: 'Roadmap', to: '/student/roadmap', icon: Compass },
    { label: 'Daily Missions', to: '/student/missions', icon: Flame },
    { label: 'Job Search', to: '/student/jobs', icon: Briefcase },
    { label: 'Applications', to: '/student/applications', icon: Send },
    { label: 'Passport', to: '/student/career-passport', icon: QrCode },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FBFBFD' }}>
      <Navbar />

      {/* Sleek Apple-style Sub-navigation Bar */}
      <div
        style={{
          marginTop: '70px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.07)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: '64px',
          zIndex: 90,
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', gap: '0.4rem', padding: '0.6rem 1.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to || (item.to !== '/student/dashboard' && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  fontSize: '0.86rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#FFFFFF' : '#424245',
                  backgroundColor: active ? '#1D1D1F' : 'transparent',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <Icon size={15} color={active ? '#FFFFFF' : '#6E6E73'} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      <main style={{ flex: 1, padding: '2.5rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
