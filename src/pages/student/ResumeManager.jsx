import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { FileText, Plus, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ResumeManager() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getResumes()
      .then(setResumes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title" style={{ marginBottom: '0.4rem' }}>Resumes & ATS Versions</h1>
          <p className="section-subtitle">Manage your tailored resumes for specific job twin profiles.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <Link to="/student/ats" className="btn-apple btn-apple-secondary" style={{ fontSize: '0.9rem' }}>
            <Sparkles size={16} color="#0071E3" />
            <span>Run ATS Scan</span>
          </Link>
          <Link to="/student/resume-builder" className="btn-apple btn-apple-primary" style={{ fontSize: '0.9rem' }}>
            <Plus size={16} />
            <span>Open Resume Studio</span>
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {resumes.map((r) => (
          <div key={r.id} className="apple-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge-pill badge-blue">{r.templateType} Template</span>
                {r.isPrimary && <span className="badge-pill badge-success">Primary Active</span>}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{r.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#6E6E73', marginBottom: '1.5rem' }}>
                Optimized for enterprise ATS engines and parsed via Apache PDFBox standards.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.2rem' }}>
              <Link to="/student/resume-builder" className="btn-apple btn-apple-secondary" style={{ flex: 1, fontSize: '0.85rem', padding: '0.55rem' }}>
                Edit in Studio
              </Link>
              <Link to="/student/ats" className="btn-apple btn-apple-primary" style={{ flex: 1, fontSize: '0.85rem', padding: '0.55rem' }}>
                View ATS Breakdown
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
