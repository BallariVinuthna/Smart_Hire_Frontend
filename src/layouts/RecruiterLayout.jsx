import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Users, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RecruiterLayout() {
  const navItems = [
    { label: 'Talent Intelligence', to: '/recruiter/dashboard', icon: Sparkles },
    { label: 'Manage Jobs', to: '/recruiter/jobs', icon: Briefcase },
    { label: 'Candidate Matrix', to: '/recruiter/candidates', icon: Users },
    { label: 'AI Recruiter Co-Pilot (RAG)', to: '/recruiter/ai-assistant', icon: Sparkles }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FBFBFD' }}>
      <Navbar />
      <div style={{ marginTop: '70px', borderBottom: '1px solid rgba(0,0,0,0.07)', backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', position: 'sticky', top: '64px', zIndex: 90 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', gap: '0.5rem', padding: '0.6rem 1.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FFFFFF' : '#424245',
                  backgroundColor: isActive ? '#1D1D1F' : 'transparent',
                  transition: 'all 0.2s ease'
                })}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
      <main style={{ flex: 1, padding: '2.5rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
