import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FileText, Download, Save, Check, Sparkles, Printer, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResumeBuilder() {
  const [template, setTemplate] = useState('Modern'); // Minimal, Modern, Developer, Executive, Fresher
  const [activeTab, setActiveTab] = useState('personal');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState(null);

  const [resumeData, setResumeData] = useState({
    fullName: 'Ballari Vinuthna',
    title: 'Full Stack Java Engineer',
    email: 'student@smarthire.ai',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    github: 'https://github.com/ballari-vinuthna',
    linkedin: 'https://linkedin.com/in/ballarivinuthna',
    summary: 'Results-driven Full Stack Java Engineer with verified mastery in Spring Boot microservices, high-throughput REST APIs, and reactive React SPAs. Solid foundations in system design, distributed data stores, and containerization.',
    skills: 'Java 17, Spring Boot, Spring Security, Hibernate JPA, React, TypeScript, SQL, Docker, Git, REST APIs, Microservices, Redis, AWS',
    experience: [
      {
        id: 1,
        title: 'Software Engineering Fellow',
        company: 'Tech Accelerate Lab',
        duration: 'May 2025 - Aug 2025',
        description: 'Architected Spring Boot microservices for asynchronous payload validation. Designed scalable database schema with connection pooling, reducing query overhead by 35%.'
      }
    ],
    projects: [
      {
        id: 1,
        name: 'SmartHire Career Readiness Core',
        tech: 'Java 17, Spring Boot, MySQL, JWT, Docker',
        description: 'Built resilient microservices with JWT authentication and Apache PDFBox parsing. Containerized services with Docker multi-stage builds.'
      },
      {
        id: 2,
        name: 'Distributed Stream Processing Engine',
        tech: 'Java 17, Apache Kafka, Redis, PostgreSQL',
        description: 'Implemented high-throughput event listener handling 10k messages/sec with idempotent state reconciliation and sub-20ms P95 latency.'
      }
    ],
    education: [
      {
        id: 1,
        school: 'National Institute of Technology',
        degree: 'B.Tech in Computer Science & Engineering',
        year: '2023 - 2027',
        grade: '8.92 CGPA'
      }
    ],
    certifications: 'Oracle Certified Professional: Java SE 17 Developer, AWS Certified Cloud Practitioner'
  });

  useEffect(() => {
    // Load primary resume if exists
    api.getResumes()
      .then((resumes) => {
        if (resumes && resumes.length > 0) {
          const primary = resumes.find(r => r.isPrimary) || resumes[0];
          setResumeId(primary.id);
          setTemplate(primary.templateType || 'Modern');
          if (primary.contentJson) {
            try {
              const parsed = JSON.parse(primary.contentJson);
              setResumeData(prev => ({ ...prev, ...parsed }));
            } catch (e) {
              console.error("Error parsing resume JSON:", e);
            }
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        title: `${resumeData.fullName} - ${template} Resume`,
        templateType: template,
        isPrimary: true,
        contentJson: JSON.stringify(resumeData)
      };

      if (resumeId) {
        await api.updateResume(resumeId, payload);
      } else {
        const created = await api.createResume(payload);
        setResumeId(created.id);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Top Studio Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/student/resumes" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', color: '#6E6E73', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> All Resumes
          </Link>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Resume Studio</h1>
          <span className="badge-pill badge-blue">ATS-Engine Optimized</span>
        </div>

        {/* Template Selector & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', backgroundColor: '#EBEBED', padding: '0.25rem', borderRadius: '999px', gap: '0.2rem' }}>
            {['Minimal', 'Modern', 'Developer', 'Executive', 'Fresher'].map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: template === t ? '#FFFFFF' : 'transparent',
                  color: template === t ? '#1D1D1F' : '#6E6E73',
                  fontWeight: template === t ? 600 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: template === t ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-apple btn-apple-secondary"
            style={{ fontSize: '0.88rem', padding: '0.55rem 1.1rem' }}
          >
            {saved ? <Check size={16} color="#10B981" /> : <Save size={16} />}
            <span>{saved ? 'Saved' : saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-apple btn-apple-primary"
            style={{ fontSize: '0.88rem', padding: '0.55rem 1.2rem' }}
          >
            <Printer size={16} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Split Studio: Editor Controls (Left) & Real-time Resume Preview (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem', alignItems: 'flex-start' }} className="studio-grid">
        
        {/* Left: Section Accordions / Inputs */}
        <div className="apple-card" style={{ padding: '1.5rem', maxHeight: '85vh', overflowY: 'auto' }}>
          {/* Section Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.8rem' }}>
            {['personal', 'experience', 'projects', 'skills', 'education'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === tab ? '#1D1D1F' : 'transparent',
                  color: activeTab === tab ? '#FFFFFF' : '#6E6E73',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Personal Details */}
          {activeTab === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="apple-label">Full Name</label>
                <input
                  className="apple-input"
                  value={resumeData.fullName}
                  onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="apple-label">Professional Title</label>
                <input
                  className="apple-input"
                  value={resumeData.title}
                  onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="apple-label">Email</label>
                <input
                  className="apple-input"
                  value={resumeData.email}
                  onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="apple-label">Phone</label>
                <input
                  className="apple-input"
                  value={resumeData.phone}
                  onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="apple-label">Location</label>
                <input
                  className="apple-input"
                  value={resumeData.location}
                  onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="apple-label">Executive Summary</label>
                <textarea
                  className="apple-input"
                  rows={4}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Experience */}
          {activeTab === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {resumeData.experience.map((exp, idx) => (
                <div key={exp.id} style={{ padding: '1rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px' }}>
                  <div style={{ marginBottom: '0.6rem' }}>
                    <label className="apple-label">Job Title</label>
                    <input
                      className="apple-input"
                      value={exp.title}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[idx].title = e.target.value;
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '0.6rem' }}>
                    <label className="apple-label">Company & Duration</label>
                    <input
                      className="apple-input"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[idx].company = e.target.value;
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                    />
                  </div>
                  <div>
                    <label className="apple-label">Bullet Achievements</label>
                    <textarea
                      className="apple-input"
                      rows={3}
                      value={exp.description}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[idx].description = e.target.value;
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Projects */}
          {activeTab === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {resumeData.projects.map((proj, idx) => (
                <div key={proj.id} style={{ padding: '1rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px' }}>
                  <div style={{ marginBottom: '0.6rem' }}>
                    <label className="apple-label">Project Name</label>
                    <input
                      className="apple-input"
                      value={proj.name}
                      onChange={(e) => {
                        const updated = [...resumeData.projects];
                        updated[idx].name = e.target.value;
                        setResumeData({ ...resumeData, projects: updated });
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '0.6rem' }}>
                    <label className="apple-label">Technologies Used</label>
                    <input
                      className="apple-input"
                      value={proj.tech}
                      onChange={(e) => {
                        const updated = [...resumeData.projects];
                        updated[idx].tech = e.target.value;
                        setResumeData({ ...resumeData, projects: updated });
                      }}
                    />
                  </div>
                  <div>
                    <label className="apple-label">Impact Description</label>
                    <textarea
                      className="apple-input"
                      rows={3}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...resumeData.projects];
                        updated[idx].description = e.target.value;
                        setResumeData({ ...resumeData, projects: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Skills */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="apple-label">Technical Skills (Comma separated)</label>
                <textarea
                  className="apple-input"
                  rows={4}
                  value={resumeData.skills}
                  onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                />
              </div>
              <div>
                <label className="apple-label">Certifications</label>
                <textarea
                  className="apple-input"
                  rows={3}
                  value={resumeData.certifications}
                  onChange={(e) => setResumeData({ ...resumeData, certifications: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Tab 5: Education */}
          {activeTab === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {resumeData.education.map((edu, idx) => (
                <div key={edu.id} style={{ padding: '1rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px' }}>
                  <div style={{ marginBottom: '0.6rem' }}>
                    <label className="apple-label">Institution</label>
                    <input
                      className="apple-input"
                      value={edu.school}
                      onChange={(e) => {
                        const updated = [...resumeData.education];
                        updated[idx].school = e.target.value;
                        setResumeData({ ...resumeData, education: updated });
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '0.6rem' }}>
                    <label className="apple-label">Degree & Year</label>
                    <input
                      className="apple-input"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...resumeData.education];
                        updated[idx].degree = e.target.value;
                        setResumeData({ ...resumeData, education: updated });
                      }}
                    />
                  </div>
                  <div>
                    <label className="apple-label">Grade / CGPA</label>
                    <input
                      className="apple-input"
                      value={edu.grade}
                      onChange={(e) => {
                        const updated = [...resumeData.education];
                        updated[idx].grade = e.target.value;
                        setResumeData({ ...resumeData, education: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right: Live Resume Sheet Preview with 5 Switchable Templates */}
        <div
          id="resume-printable"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.08)',
            minHeight: '840px',
            padding: template === 'Minimal' ? '3.5rem' : '3rem',
            fontFamily: template === 'Developer' ? 'var(--font-mono)' : 'var(--font-sans)',
            color: '#111111'
          }}
        >
          {/* Header */}
          <div style={{ borderBottom: template === 'Minimal' ? '2px solid #111111' : template === 'Modern' ? '2px solid #0071E3' : '1px solid #E5E5EA', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: template === 'Modern' ? '#0071E3' : '#111111' }}>
              {resumeData.fullName}
            </h1>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#48484A', marginTop: '0.2rem' }}>
              {resumeData.title}
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#6E6E73', marginTop: '0.6rem', flexWrap: 'wrap' }}>
              <span>{resumeData.email}</span>
              <span>•</span>
              <span>{resumeData.phone}</span>
              <span>•</span>
              <span>{resumeData.location}</span>
            </div>
          </div>

          {/* Summary */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: template === 'Modern' ? '#0071E3' : '#111111', marginBottom: '0.6rem' }}>
              Professional Summary
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#2C2C2E' }}>
              {resumeData.summary}
            </p>
          </div>

          {/* Technical Skills */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: template === 'Modern' ? '#0071E3' : '#111111', marginBottom: '0.6rem' }}>
              Technical Expertise
            </h3>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#2C2C2E' }}>
              {resumeData.skills}
            </p>
          </div>

          {/* Experience */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: template === 'Modern' ? '#0071E3' : '#111111', marginBottom: '1rem' }}>
              Experience
            </h3>
            {resumeData.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '1.05rem', color: '#111111' }}>{exp.title}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#6E6E73' }}>{exp.duration}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#48484A', fontWeight: 500, marginBottom: '0.4rem' }}>
                  {exp.company}
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: '#3A3A3C' }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: template === 'Modern' ? '#0071E3' : '#111111', marginBottom: '1rem' }}>
              Production Projects
            </h3>
            {resumeData.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '1.05rem', color: '#111111' }}>{proj.name}</strong>
                  <span style={{ fontSize: '0.82rem', color: '#0071E3', fontWeight: 600 }}>{proj.tech}</span>
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: '#3A3A3C', marginTop: '0.3rem' }}>
                  {proj.description}
                </p>
              </div>
            ))}
          </div>

          {/* Education & Credentials */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: template === 'Modern' ? '#0071E3' : '#111111', marginBottom: '0.8rem' }}>
              Education & Certifications
            </h3>
            {resumeData.education.map((edu) => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <div>
                  <strong>{edu.school}</strong> • {edu.degree}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6E6E73' }}>
                  {edu.grade} ({edu.year})
                </div>
              </div>
            ))}
            <div style={{ fontSize: '0.88rem', color: '#48484A', marginTop: '0.6rem' }}>
              {resumeData.certifications}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
