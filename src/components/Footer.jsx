import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0B0B0D', color: '#86868B', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '5rem 2rem 3rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFFFFF', marginBottom: '1rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #0071E3 0%, #8656EF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>SmartHire X</span>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#A1A1A6' }}>
              Don't Just Apply. Become Job-Ready.<br />
              The AI career readiness and placement intelligence platform built for modern engineering talent.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.2rem', letterSpacing: '-0.01em' }}>Core Engines</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <Link to="/#career-dna" style={{ color: 'inherit', textDecoration: 'none' }}>Career DNA</Link>
              <Link to="/#job-twin" style={{ color: 'inherit', textDecoration: 'none' }}>Job Twin Simulator</Link>
              <Link to="/#readiness" style={{ color: 'inherit', textDecoration: 'none' }}>Career Readiness Engine</Link>
              <Link to="/#what-if" style={{ color: 'inherit', textDecoration: 'none' }}>What-If Career Simulator</Link>
              <Link to="/student/ats" style={{ color: 'inherit', textDecoration: 'none' }}>ATS Truth Checker</Link>
              <Link to="/student/interviews" style={{ color: 'inherit', textDecoration: 'none' }}>AI Interview Simulator</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.2rem', letterSpacing: '-0.01em' }}>For Organizations</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <Link to="/recruiter/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Talent Intelligence Matrix</Link>
              <Link to="/placement/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>University Batch Readiness</Link>
              <Link to="/placement/drives" style={{ color: 'inherit', textDecoration: 'none' }}>Campus Placement Drives</Link>
              <Link to="/admin/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Platform Administration</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.2rem', letterSpacing: '-0.01em' }}>Evidence & Standards</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={14} color="#10B981" /> Cryptographic Verifications
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Cpu size={14} color="#0071E3" /> Dual-Mode AI Inferences
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={14} color="#F59E0B" /> Verified Career Passports
              </span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.82rem' }}>
          <div>
            Copyright © {new Date().getFullYear()} SmartHire X Systems. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Architecture</span>
            <span>System Status: 99.99% Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
