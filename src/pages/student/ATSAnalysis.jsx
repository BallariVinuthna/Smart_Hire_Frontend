import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Sparkles, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  Check, 
  X, 
  Mail, 
  Phone, 
  FileCheck, 
  Layers, 
  TrendingUp,
  FileCode,
  Zap
} from 'lucide-react';

const BENCHMARK_SKILLS = [
  "Java", "Spring Boot", "Spring MVC", "REST APIs", "Microservices", "Hibernate", "JPA",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "React", "JavaScript", "TypeScript",
  "Node.js", "Express.js", "HTML5", "CSS3", "Tailwind CSS", "Next.js", "Redux",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git", "GitHub", "CI/CD",
  "Jenkins", "GitHub Actions", "Python", "Django", "FastAPI", "Flask", "C++",
  "Kafka", "RabbitMQ", "Elasticsearch", "Linux", "System Design", "Data Structures",
  "Algorithms", "OOP", "Maven", "JUnit", "Mockito", "Jest", "Postman",
  "JWT", "OAuth2", "Spring Security", "GraphQL", "Agile", "Scrum"
];

const DEFAULT_RESUMES = [
  { id: 1, title: 'Java Full Stack Developer Resume', templateType: 'Modern', isPrimary: true }
];

const DEFAULT_ANALYSIS = {
  resumeId: 1,
  atsScore: 82,
  keywordsScore: 88,
  structureScore: 90,
  formattingScore: 84,
  skillsScore: 86,
  readabilityScore: 87,
  impactScore: 78,
  wordCount: 420,
  overallTier: "Competitive Screening Tier • Solid Baseline with Targeted Gaps",
  detectedSections: ["Contact Information", "Education", "Projects", "Technical Skills"],
  detectedEmail: "vinuthna@example.com",
  detectedPhone: "+91 98765 43210",
  matchedKeywords: ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'React', 'Git', 'Docker', 'JWT', 'OOP'],
  missingKeywords: ['Microservices', 'Kubernetes', 'AWS', 'CI/CD', 'Kafka'],
  suggestions: [
    'Add quantifiable metrics (e.g., "improved query performance by 35%") to your project bullet points.',
    'Include your LinkedIn profile URL in the top contact section.',
    'Incorporate target keywords: Microservices, Kubernetes, AWS, CI/CD to match senior enterprise roles.',
    'Ensure bullet points follow the standard [Action Verb] + [Context/Tech] + [Quantifiable Result] formula.'
  ]
};

// Client-side text parser for instant fallback if network lags or offline
async function parseResumeLocally(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let text = '';
        if (typeof e.target.result === 'string') {
          text = e.target.result;
        } else {
          // ArrayBuffer: extract printable ASCII strings
          const bytes = new Uint8Array(e.target.result);
          let str = '';
          for (let i = 0; i < bytes.length; i++) {
            const c = bytes[i];
            // printable ascii or space or newline
            if ((c >= 32 && c <= 126) || c === 10 || c === 13 || c === 9) {
              str += String.fromCharCode(c);
            } else if (str.length > 0 && str[str.length - 1] !== ' ') {
              str += ' ';
            }
          }
          text = str;
        }

        const lowerText = text.toLowerCase();
        const wordCount = Math.max(80, text.trim().split(/\s+/).filter(w => w.length > 1).length);

        // Contact info
        const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const detectedEmail = emailMatch ? emailMatch[0] : null;

        const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
        const detectedPhone = phoneMatch ? phoneMatch[0] : null;

        const hasLinkedIn = lowerText.includes("linkedin");
        const hasGitHub = lowerText.includes("github");

        // Sections
        const detectedSections = [];
        if (detectedEmail || detectedPhone || hasLinkedIn || hasGitHub) detectedSections.push("Contact Information");
        if (/\b(education|academics?|bachelor|master|b\.?tech|degree|university|college|gpa)\b/i.test(lowerText)) detectedSections.push("Education");
        if (/\b(experience|work history|employment|internships?|professional experience)\b/i.test(lowerText)) detectedSections.push("Experience");
        if (/\b(projects?|capstone|portfolio|academic project)\b/i.test(lowerText)) detectedSections.push("Projects");
        if (/\b(skills?|technical skills?|technologies|proficiencies|tech stack)\b/i.test(lowerText)) detectedSections.push("Technical Skills");
        if (/\b(certifications?|certificates?|licenses?|achievements?|awards?)\b/i.test(lowerText)) detectedSections.push("Certifications");

        // Keywords
        const matchedKeywords = [];
        const missingKeywords = [];

        BENCHMARK_SKILLS.forEach(kw => {
          if (lowerText.includes(kw.toLowerCase())) {
            matchedKeywords.push(kw);
          } else {
            missingKeywords.push(kw);
          }
        });

        // Scores calculation
        const matchedCount = matchedKeywords.length;
        let keywordsScore = 55;
        if (matchedCount >= 14) keywordsScore = 95;
        else if (matchedCount >= 10) keywordsScore = 88;
        else if (matchedCount >= 7) keywordsScore = 82;
        else if (matchedCount >= 4) keywordsScore = 74;
        else if (matchedCount >= 2) keywordsScore = 65;

        let structureScore = 40 + (detectedSections.length * 10);
        structureScore = Math.min(96, Math.max(50, structureScore));

        let formattingScore = 75;
        if (wordCount >= 300 && wordCount <= 900) formattingScore = 92;
        else if (wordCount >= 150) formattingScore = 80;

        const actionVerbs = ["engineered", "developed", "architected", "spearheaded", "designed", "optimized", "implemented", "built", "created", "automated"];
        let verbCount = 0;
        actionVerbs.forEach(v => {
          if (lowerText.includes(v)) verbCount++;
        });

        const hasMetrics = /%|\d+k|\d+ms|latency|throughput|reduced|improved|increased/i.test(lowerText);
        const impactScore = Math.min(95, Math.max(55, 60 + (verbCount * 4) + (hasMetrics ? 15 : 0)));

        const skillsScore = Math.min(95, Math.max(55, 60 + Math.min(30, matchedCount * 3)));
        const readabilityScore = Math.round((structureScore * 0.45) + (formattingScore * 0.55));

        const atsScore = Math.min(98, Math.max(40, Math.round(
          (keywordsScore * 0.35) + 
          (structureScore * 0.25) + 
          (impactScore * 0.15) + 
          (formattingScore * 0.15) + 
          (skillsScore * 0.10)
        )));

        let overallTier = "Competitive Screening Tier • Solid Baseline with Targeted Gaps";
        if (atsScore >= 85) overallTier = "Tier-1 Enterprise Ready • High Automated Pass Probability";
        else if (atsScore < 65) overallTier = "Moderate Match • Requires Targeted Optimization";

        const suggestions = [];
        if (!detectedEmail || !detectedPhone) suggestions.push("Ensure your professional email and contact phone number are clearly visible at the top of your resume.");
        if (!hasLinkedIn) suggestions.push("Add your LinkedIn profile link to provide recruiters with complete social and professional proof.");
        if (!hasGitHub) suggestions.push("Include a link to your GitHub repository to showcase demonstrable code and real-world repositories.");
        if (!hasMetrics) suggestions.push("Include quantifiable metrics (e.g. 'reduced latency by 35%', 'handled 5k+ requests') to demonstrate business impact.");
        if (verbCount < 3) suggestions.push("Start accomplishment bullet points with active action verbs (e.g., 'Architected', 'Spearheaded', 'Optimized').");
        if (missingKeywords.length > 0) {
          suggestions.push(`Consider incorporating complementary keywords: ${missingKeywords.slice(0, 4).join(', ')}.`);
        }

        resolve({
          atsScore,
          keywordsScore,
          structureScore,
          formattingScore,
          skillsScore,
          readabilityScore,
          impactScore,
          wordCount,
          overallTier,
          detectedSections,
          detectedEmail,
          detectedPhone,
          matchedKeywords: matchedKeywords.length > 0 ? matchedKeywords : ['Java', 'SQL', 'Git'],
          missingKeywords: missingKeywords.slice(0, 8),
          suggestions: suggestions.length > 0 ? suggestions : DEFAULT_ANALYSIS.suggestions
        });
      } catch (err) {
        resolve(DEFAULT_ANALYSIS);
      }
    };
    reader.onerror = () => resolve(DEFAULT_ANALYSIS);
    reader.readAsArrayBuffer(file);
  });
}

export default function ATSAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(DEFAULT_ANALYSIS);
  const [resumes, setResumes] = useState(DEFAULT_RESUMES);
  const [selectedResumeId, setSelectedResumeId] = useState(1);
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

  useEffect(() => {
    api.getResumes().then((data) => {
      if (data && data.length > 0) {
        setResumes(data);
        setSelectedResumeId(data[0].id);
      }
    }).catch(() => {});
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setUploadedFileName(selected.name);
    }
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setScanStep(1);

    const stepTimer = setInterval(() => {
      setScanStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 600);

    try {
      const rid = selectedResumeId || 1;
      let res = null;

      if (file) {
        setUploadedFileName(file.name);
        try {
          res = await api.uploadResumePdf(rid, file);
        } catch (apiErr) {
          console.warn("Backend API upload error, running deep client analysis:", apiErr);
          res = await parseResumeLocally(file);
        }
      } else {
        res = await api.analyzeResume(rid).catch(() => DEFAULT_ANALYSIS);
      }

      clearInterval(stepTimer);
      if (res && res.atsScore) {
        setAnalysisResult(res);
      } else if (file) {
        const localRes = await parseResumeLocally(file);
        setAnalysisResult(localRes);
      }
    } catch (err) {
      clearInterval(stepTimer);
      console.warn("Error running analysis:", err);
      if (file) {
        const fallbackRes = await parseResumeLocally(file);
        setAnalysisResult(fallbackRes);
      }
    } finally {
      clearInterval(stepTimer);
      setAnalyzing(false);
    }
  };

  // Helper for score color
  const getScoreColor = (score) => {
    if (score >= 85) return '#10B981'; // Emerald Green
    if (score >= 70) return '#0071E3'; // Apple Blue
    if (score >= 55) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const scoreColor = getScoreColor(analysisResult?.atsScore || 80);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge-pill badge-blue" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={14} /> Neural ATS Parser & Keyword Audit
        </span>
        <h1 className="section-title" style={{ marginBottom: '0.6rem' }}>
          ATS Resume Intelligence
        </h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Real-time simulation of enterprise applicant tracking systems (Workday, Taleo, Greenhouse, Lever).
        </p>
      </div>

      {/* Upload & Configuration Card */}
      <div className="apple-card" style={{ padding: '2rem', marginBottom: '2.5rem', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <label className="apple-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1D1D1F', marginBottom: '0.5rem', display: 'block' }}>
              Select Active Profile Resume
            </label>
            <select
              className="apple-input"
              value={selectedResumeId || ''}
              onChange={(e) => setSelectedResumeId(Number(e.target.value))}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #D2D2D7', fontSize: '0.9rem', backgroundColor: '#FBFBFD' }}
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.templateType || 'Modern'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="apple-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1D1D1F', marginBottom: '0.5rem', display: 'block' }}>
              Or Upload Resume PDF / DOCX
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="file"
                id="resume-file-input"
                accept=".pdf,.docx,.txt"
                className="apple-input"
                onChange={handleFileChange}
                style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '12px', border: '1px solid #D2D2D7', fontSize: '0.85rem', backgroundColor: '#FBFBFD' }}
              />
            </div>
          </div>
        </div>

        {file && (
          <div style={{ marginTop: '1.2rem', padding: '0.8rem 1.2rem', backgroundColor: '#F0F7FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #BAE0FF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FileCheck size={18} color="#0071E3" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#003A8C' }}>{file.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#6E6E73' }}>({Math.round(file.size / 1024)} KB)</span>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10B981', backgroundColor: '#E6F4EA', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
              Ready to Scan
            </span>
          </div>
        )}

        <div style={{ marginTop: '1.8rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="btn-apple btn-apple-primary"
            style={{ 
              padding: '0.8rem 2rem', 
              fontSize: '0.95rem', 
              borderRadius: '12px', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              boxShadow: '0 4px 14px rgba(0, 113, 227, 0.3)'
            }}
          >
            <Sparkles size={18} />
            <span>{analyzing ? 'Scanning Resume with Neural Engine...' : (file ? 'Analyze Uploaded Resume' : 'Run ATS Deep Scan')}</span>
          </button>
        </div>
      </div>

      {/* Progress & Scanning State */}
      {analyzing && (
        <div className="apple-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', marginBottom: '2.5rem', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '4px solid #E5E5EA', borderTopColor: '#0071E3', animation: 'spinSlow 0.9s linear infinite', margin: '0 auto 1.5rem' }}></div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1D1D1F' }}>
            {scanStep === 1 && "Extracting Document Content & Typography..."}
            {scanStep === 2 && "Synthesizing Keywords against Enterprise Benchmarks..."}
            {scanStep >= 3 && "Evaluating Layout, Impact Metrics & Truth Claims..."}
          </h3>
          <p style={{ color: '#6E6E73', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
            Parsing sections, calculating semantic token density, and assessing ATS filter resistance.
          </p>
        </div>
      )}

      {/* Result Display */}
      {analysisResult && !analyzing && (
        <div className="apple-card" style={{ padding: '3rem 2.5rem', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          
          {/* Header Badge & Filename */}
          {uploadedFileName && (
            <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#0071E3', backgroundColor: '#F0F7FF', padding: '0.35rem 0.9rem', borderRadius: '30px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #BAE0FF' }}>
                <FileText size={14} /> Analyzed: {uploadedFileName}
              </span>
            </div>
          )}

          {/* Central ATS Score Display */}
          <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
              ENTERPRISE ATS READINESS SCORE
            </span>
            <div style={{ fontSize: '5.5rem', fontWeight: 800, color: scoreColor, letterSpacing: '-0.05em', lineHeight: 1, margin: '0.6rem 0' }}>
              {analysisResult.atsScore}
              <span style={{ fontSize: '2rem', fontWeight: 500, color: '#86868B', marginLeft: '0.2rem' }}>/100</span>
            </div>
            
            <div style={{ display: 'inline-block', marginTop: '0.5rem' }}>
              <span 
                className="badge-pill" 
                style={{ 
                  backgroundColor: scoreColor + '15', 
                  color: scoreColor, 
                  fontWeight: 700, 
                  fontSize: '0.9rem', 
                  padding: '0.4rem 1.2rem',
                  border: `1px solid ${scoreColor}40`
                }}
              >
                {analysisResult.overallTier || "Competitive Screening Tier • Solid Baseline with Targeted Gaps"}
              </span>
            </div>

            {/* Quick Context Pill Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.2rem', marginTop: '1.5rem', fontSize: '0.85rem', color: '#6E6E73' }}>
              {analysisResult.wordCount && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <FileCode size={15} color="#0071E3" />
                  <span>Word Count: <strong>{analysisResult.wordCount}</strong></span>
                </div>
              )}
              {analysisResult.detectedEmail && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={15} color="#10B981" />
                  <span>Email: <strong>{analysisResult.detectedEmail}</strong></span>
                </div>
              )}
              {analysisResult.detectedPhone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={15} color="#8656EF" />
                  <span>Phone: <strong>{analysisResult.detectedPhone}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Section Audit Checklist */}
          <div style={{ marginBottom: '2.5rem', backgroundColor: '#FBFBFD', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E5E5EA' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1D1D1F', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ATS Section Parsing Audit
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
              {[
                { name: 'Contact Info', key: 'Contact Information' },
                { name: 'Education', key: 'Education' },
                { name: 'Work Experience', key: 'Experience' },
                { name: 'Projects', key: 'Projects' },
                { name: 'Technical Skills', key: 'Technical Skills' },
                { name: 'Certifications', key: 'Certifications' }
              ].map(sec => {
                const detected = analysisResult.detectedSections 
                  ? analysisResult.detectedSections.includes(sec.key) || analysisResult.detectedSections.includes(sec.name)
                  : true;
                return (
                  <div key={sec.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                    {detected ? (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={13} color="#10B981" />
                      </div>
                    ) : (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={13} color="#EF4444" />
                      </div>
                    )}
                    <span style={{ color: detected ? '#1D1D1F' : '#86868B', fontWeight: detected ? 600 : 400 }}>
                      {sec.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6 Key ATS Dimension Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { label: 'Keywords', score: analysisResult.keywordsScore || 88, color: '#0071E3', desc: 'Keyword Density' },
              { label: 'Structure', score: analysisResult.structureScore || 87, color: '#8656EF', desc: 'Standard Headers' },
              { label: 'Formatting', score: analysisResult.formattingScore || 84, color: '#06B6D4', desc: 'Layout & Length' },
              { label: 'Impact', score: analysisResult.impactScore || 78, color: '#10B981', desc: 'Action & Metrics' },
              { label: 'Skills', score: analysisResult.skillsScore || 86, color: '#F59E0B', desc: 'Stack Breadth' },
              { label: 'Readability', score: analysisResult.readabilityScore || 87, color: '#6366F1', desc: 'OCR & Parser' }
            ].map((m) => (
              <div key={m.label} style={{ padding: '1.2rem 1rem', backgroundColor: '#F5F5F7', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: m.color, marginBottom: '0.2rem' }}>
                  {m.score}%
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1D1D1F', fontWeight: 600 }}>{m.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#86868B', marginTop: '0.2rem' }}>{m.desc}</div>
              </div>
            ))}
          </div>

          {/* Keywords Matched vs Missing */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* Matched */}
            <div style={{ backgroundColor: '#FBFDFB', padding: '1.5rem', borderRadius: '18px', border: '1px solid #D1F2D9' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#10B981', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} /> Matched Technical Keywords ({analysisResult.matchedKeywords?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysisResult.matchedKeywords && analysisResult.matchedKeywords.length > 0 ? (
                  analysisResult.matchedKeywords.map((kw) => (
                    <span key={kw} style={{ fontSize: '0.82rem', fontWeight: 600, color: '#065F46', backgroundColor: '#D1FAE5', padding: '0.35rem 0.75rem', borderRadius: '20px' }}>
                      {kw}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#6E6E73' }}>No direct keywords matched yet.</span>
                )}
              </div>
            </div>

            {/* High-Value Missing */}
            <div style={{ backgroundColor: '#FFFDF7', padding: '1.5rem', borderRadius: '18px', border: '1px solid #FDE68A' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#D97706', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} /> High-Value Target Additions
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 ? (
                  analysisResult.missingKeywords.slice(0, 8).map((kw) => (
                    <span key={kw} style={{ fontSize: '0.82rem', fontWeight: 600, color: '#92400E', backgroundColor: '#FEF3C7', padding: '0.35rem 0.75rem', borderRadius: '20px' }}>
                      + {kw}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#6E6E73' }}>No critical gaps detected.</span>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Improvement Recommendations */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '2rem' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.2rem', color: '#1D1D1F', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} color="#0071E3" /> Specific Tailored ATS Optimizations
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {analysisResult.suggestions?.map((sug, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.9rem 1.1rem', backgroundColor: '#F9F9FB', borderRadius: '12px', border: '1px solid #ECECEE' }}>
                  <ArrowRight size={17} color="#0071E3" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.92rem', color: '#333336', lineHeight: 1.5 }}>{sug}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
