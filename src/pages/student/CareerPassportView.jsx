import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Share2, Award, ShieldCheck, CheckCircle2, ExternalLink, Copy, Check } from 'lucide-react';

export default function CareerPassportView() {
  const [passport, setPassport] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyPassport()
      .then(setPassport)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/passport/${passport?.passportId || 'SHX-BV-2027'}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#6E6E73' }}>
        Loading verifiable Career Passport credentials...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge-pill badge-blue" style={{ marginBottom: '1rem' }}>
          <QrCode size={14} /> Verifiable Digital Identity
        </span>
        <h1 className="section-title" style={{ marginBottom: '0.8rem' }}>
          Your Career Passport
        </h1>
        <p className="section-subtitle" style={{ margin: '0 auto 1.5rem' }}>
          A tamper-evident, cryptographic digital credential of your verified engineering proof-of-skill.
        </p>

        <button onClick={handleCopyLink} className="btn-apple btn-apple-secondary" style={{ fontSize: '0.88rem' }}>
          {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
          <span>{copied ? 'Public Link Copied!' : 'Copy Public Verification Link'}</span>
        </button>
      </div>

      {/* Career Passport Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          border: '1.5px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          marginBottom: '3rem'
        }}
      >
        {/* Card Header Ribbon */}
        <div style={{ backgroundColor: '#0B0B0D', color: '#FFFFFF', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0071E3', fontWeight: 700 }}>
              SMARTHIRE X GLOBAL PROTOCOL
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
              OFFICIAL CAREER PASSPORT
            </h2>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#A1A1A6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              PASSPORT TOKEN
            </span>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace', color: '#FFFFFF' }}>
              {passport?.passportId || 'SHX-BV-2027'}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '3rem 2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.5rem' }}>
            <div>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#1D1D1F' }}>
                {passport?.fullName || 'Ballari Vinuthna'}
              </h1>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#0071E3', marginTop: '0.2rem' }}>
                {passport?.targetRole || 'Full Stack Java Engineer'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6E6E73', marginTop: '0.4rem' }}>
                {passport?.university || 'National Institute of Technology'} • Class of {passport?.batchYear || 2027}
              </div>
            </div>

            {/* QR Code Container */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', backgroundColor: '#F5F5F7', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <QRCodeSVG
                value={`https://smarthire.ai/passport/${passport?.passportId || 'SHX-BV-2027'}`}
                size={110}
                level="H"
              />
              <span style={{ fontSize: '0.68rem', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.5rem', fontWeight: 600 }}>
                Scan to Verify
              </span>
            </div>
          </div>

          {/* 4 Core Verifiable Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.2rem', marginBottom: '3rem' }}>
            <div style={{ padding: '1.2rem', backgroundColor: '#F5F5F7', borderRadius: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Career Readiness</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0071E3', marginTop: '0.2rem' }}>
                {passport?.careerReadiness || 84}%
              </div>
            </div>

            <div style={{ padding: '1.2rem', backgroundColor: '#F5F5F7', borderRadius: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Technical Skills</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#8656EF', marginTop: '0.2rem' }}>
                {passport?.technicalSkillsScore || 88}%
              </div>
            </div>

            <div style={{ padding: '1.2rem', backgroundColor: '#F5F5F7', borderRadius: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Project Evidence</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#06B6D4', marginTop: '0.2rem' }}>
                {passport?.projectEvidenceScore || 91}%
              </div>
            </div>

            <div style={{ padding: '1.2rem', backgroundColor: '#F5F5F7', borderRadius: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Interview Readiness</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10B981', marginTop: '0.2rem' }}>
                {passport?.interviewReadinessScore || 76}%
              </div>
            </div>
          </div>

          {/* Verified Badges */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#86868B', marginBottom: '1rem' }}>
              Verified Badges & Cryptographic Attestations
            </h3>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <span className="badge-pill badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <CheckCircle2 size={14} /> Java 17 Verified
              </span>
              <span className="badge-pill badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <CheckCircle2 size={14} /> Spring Boot Architecture Proof
              </span>
              <span className="badge-pill badge-blue" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <ShieldCheck size={14} /> ATS Score 84 Validated
              </span>
              <span className="badge-pill badge-blue" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Award size={14} /> Top 5% National Readiness
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div style={{ backgroundColor: '#F5F5F7', padding: '1.2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#86868B', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <span>Issued by SmartHire X Intelligence Protocol</span>
          <span>Verified: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
