import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, CheckCircle2, Award, Sparkles } from 'lucide-react';

export default function PublicPassport() {
  const { id } = useParams();
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPublicPassport(id || 'SHX-BV-2027')
      .then(setPassport)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FBFBFD' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '7rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge-pill badge-success" style={{ marginBottom: '0.8rem' }}>
              <ShieldCheck size={14} /> Cryptographically Verified Record
            </span>
            <h1 className="section-title">Verified SmartHire X Passport</h1>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Public credential registry token: <code>{id || 'SHX-BV-2027'}</code>
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}
          >
            <div style={{ backgroundColor: '#0B0B0D', color: '#FFFFFF', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0071E3', fontWeight: 700 }}>
                  SMARTHIRE X VERIFICATION
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.2rem' }}>
                  {passport?.fullName || 'Ballari Vinuthna'}
                </h2>
              </div>
              <QRCodeSVG value={window.location.href} size={70} />
            </div>

            <div style={{ padding: '2.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
                <div style={{ padding: '1.2rem', backgroundColor: '#F5F5F7', borderRadius: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Career Readiness</span>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0071E3' }}>{passport?.careerReadiness || 84}%</div>
                </div>
                <div style={{ padding: '1.2rem', backgroundColor: '#F5F5F7', borderRadius: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Technical Skills</span>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#8656EF' }}>{passport?.technicalSkillsScore || 88}%</div>
                </div>
                <div style={{ padding: '1.2rem', backgroundColor: '#F5F5F7', borderRadius: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Project Evidence</span>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#06B6D4' }}>{passport?.projectEvidenceScore || 91}%</div>
                </div>
                <div style={{ padding: '1.2rem', backgroundColor: '#F5F5F7', borderRadius: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Interview Readiness</span>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10B981' }}>{passport?.interviewReadinessScore || 76}%</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <span className="badge-pill badge-success"><CheckCircle2 size={14} /> Java 17 Verified</span>
                <span className="badge-pill badge-success"><CheckCircle2 size={14} /> Spring Boot Architecture Proof</span>
                <span className="badge-pill badge-blue"><Award size={14} /> Top 5% National Readiness</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
