import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldCheck, AlertCircle, CheckCircle2, FileQuestion, ArrowRight } from 'lucide-react';

const DEFAULT_CLAIMS = [
  {
    claim: "Designed and deployed production-grade Spring Boot REST APIs with JWT security.",
    status: "Verified",
    projectEvidence: "High",
    gitHubEvidence: "High",
    assessmentEvidence: "High",
    recommendation: "Strong alignment with your repository commits, test coverage, and assessment score."
  },
  {
    claim: "Built scalable microservices with fault-tolerant architecture.",
    status: "Partially Verified",
    projectEvidence: "Medium",
    gitHubEvidence: "Medium",
    assessmentEvidence: "Low",
    recommendation: "Revise statement to accurately reflect individual implementation or link a GitHub repo demonstrating inter-service communication."
  },
  {
    claim: "Optimized complex relational SQL queries resulting in 40% latency reduction.",
    status: "Verified",
    projectEvidence: "High",
    gitHubEvidence: "Medium",
    assessmentEvidence: "High",
    recommendation: "Verified through relational schema assessment questions and indexed queries in capstone project."
  },
  {
    claim: "Orchestrated Docker container workflows and CI/CD pipelines for zero-downtime deployment.",
    status: "Needs Evidence",
    projectEvidence: "Low",
    gitHubEvidence: "Low",
    assessmentEvidence: "None",
    recommendation: "No Dockerfile or CI workflow detected in connected repositories. Consider completing the Docker container mission before claiming orchestration."
  }
];

export default function ResumeTruthChecker() {
  const [claims, setClaims] = useState(DEFAULT_CLAIMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch resume analysis which includes truth findings
    api.getResumes().then((resumes) => {
      if (resumes && resumes.length > 0) {
        api.analyzeResume(resumes[0].id).then((data) => {
          if (data && data.truthFindings && data.truthFindings.length > 0) {
            setClaims(data.truthFindings);
          } else {
            setClaims(DEFAULT_CLAIMS);
          }
        }).catch(() => setClaims(DEFAULT_CLAIMS))
          .finally(() => setLoading(false));
      } else {
        setClaims(DEFAULT_CLAIMS);
        setLoading(false);
      }
    }).catch(() => {
      setClaims(DEFAULT_CLAIMS);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge-pill badge-warning" style={{ marginBottom: '1rem' }}>
          <ShieldCheck size={14} /> Truth Audit Engine
        </span>
        <h1 className="section-title" style={{ marginBottom: '0.8rem' }}>
          Can your resume prove it?
        </h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          SmartHire cross-checks statements on your resume against actual GitHub code commits and verified project implementations.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6E6E73' }}>
          Auditing resume claims against evidence stores...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {claims.map((claim, index) => {
            const isVerified = claim.status === 'Verified';
            return (
              <div
                key={index}
                className="apple-card"
                style={{
                  padding: '2rem',
                  borderLeft: `5px solid ${isVerified ? '#10B981' : '#F59E0B'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div style={{ maxWidth: '700px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#86868B', textTransform: 'uppercase', fontWeight: 600 }}>
                      Resume Statement
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.2rem', color: '#1D1D1F' }}>
                      "{claim.claim}"
                    </h3>
                  </div>

                  <span className={isVerified ? 'badge-pill badge-success' : 'badge-pill badge-warning'} style={{ fontSize: '0.85rem' }}>
                    {isVerified ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    <span>{claim.status}</span>
                  </span>
                </div>

                {/* Evidence Pillar Ratings */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', padding: '1.2rem', backgroundColor: '#F5F5F7', borderRadius: '14px', marginBottom: '1.2rem' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#6E6E73' }}>Project Evidence</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: claim.projectEvidence === 'High' ? '#10B981' : '#F59E0B' }}>
                      {claim.projectEvidence}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#6E6E73' }}>GitHub Code Evidence</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: claim.gitHubEvidence === 'High' ? '#10B981' : '#F59E0B' }}>
                      {claim.gitHubEvidence}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#6E6E73' }}>Adaptive Quiz Evidence</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: claim.assessmentEvidence === 'High' ? '#10B981' : '#86868B' }}>
                      {claim.assessmentEvidence}
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.92rem', color: '#424245' }}>
                  <ArrowRight size={16} color="#0071E3" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong>Recommendation: </strong>
                    <span>{claim.recommendation}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
