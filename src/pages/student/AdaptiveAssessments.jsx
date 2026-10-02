import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, ArrowRight, Award, RefreshCw } from 'lucide-react';

export default function AdaptiveAssessments() {
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAssessment();
  }, []);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setQuestions([]);
      const assessments = await api.getAssessments();
      if (assessments && assessments.length > 0) {
        const target = assessments[0];
        setAssessment(target);
        const qList = await api.getAssessmentQuestions(target.id);
        if (!qList || qList.length === 0) {
          setError('No questions found for this assessment.');
        } else {
          setQuestions(qList);
        }
      } else {
        setError('No assessments available.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load assessment. Please sign in and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionLetter) => {
    const currentQ = questions[currentIndex];
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optionLetter
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.submitAssessment(assessment.id, selectedAnswers);
      setResult(res);
      if (res.score >= 70) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#6E6E73' }}>
        Loading adaptive assessment questions...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '6rem 2rem' }}>
        <div style={{ fontSize: '1.1rem', color: '#EF4444', marginBottom: '1.5rem' }}>{error}</div>
        <button onClick={loadAssessment} className="btn-apple btn-apple-primary">
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#6E6E73' }}>
        No questions found.
      </div>
    );
  }

  // Final Results Screen
  if (result) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', padding: '3rem 1.5rem' }}>
        <div className="apple-card" style={{ padding: '3.5rem 2.5rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Award size={32} color="#10B981" />
          </div>

          <span className="badge-pill badge-success" style={{ marginBottom: '1rem' }}>
            Assessment Complete
          </span>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
            {assessment?.skillCategory || 'JAVA'}
          </h1>

          <div style={{ fontSize: '5rem', fontWeight: 800, color: '#1D1D1F', letterSpacing: '-0.05em', lineHeight: 1, margin: '1rem 0' }}>
            {result.score}%
          </div>

          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981', marginBottom: '1.5rem' }}>
            {result.foundationLevel || 'Strong Foundation'}
          </div>

          <p style={{ color: '#6E6E73', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            {result.feedback}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={loadAssessment} className="btn-apple btn-apple-secondary">
              <RefreshCw size={16} />
              <span>Retake Assessment</span>
            </button>
            <a href="/student/readiness" className="btn-apple btn-apple-primary">
              <span>View Updated Readiness</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressNum = String(currentIndex + 1).padStart(2, '0');
  const totalNum = String(questions.length).padStart(2, '0');

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Zen Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
            {assessment?.title || 'JAVA ASSESSMENT'}
          </span>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.2rem' }}>
            Question {progressNum}
          </h2>
        </div>

        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#6E6E73' }}>
          {progressNum} / {totalNum}
        </div>
      </div>

      {/* Zen Question Card */}
      <div className="apple-card" style={{ padding: '3.5rem 3rem', minHeight: '460px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Question Text */}
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.35, color: '#1D1D1F', marginBottom: '2.5rem' }}>
            {currentQ?.questionText}
          </h1>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { letter: 'A', text: currentQ?.optionA },
              { letter: 'B', text: currentQ?.optionB },
              { letter: 'C', text: currentQ?.optionC },
              { letter: 'D', text: currentQ?.optionD }
            ].filter(o => o.text).map((opt) => {
              const isSelected = selectedAnswers[currentQ?.id] === opt.letter;
              return (
                <button
                  key={opt.letter}
                  onClick={() => handleSelectOption(opt.letter)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.1rem 1.5rem',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid #0071E3' : '1px solid rgba(0,0,0,0.1)',
                    backgroundColor: isSelected ? 'rgba(0,113,227,0.06)' : '#FFFFFF',
                    color: '#1D1D1F',
                    textAlign: 'left',
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#0071E3' : '#F5F5F7',
                      color: isSelected ? '#FFFFFF' : '#6E6E73',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      flexShrink: 0
                    }}
                  >
                    {opt.letter}
                  </div>
                  <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Next Control */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
          <button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQ?.id] || submitting}
            className="btn-apple btn-apple-primary"
            style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}
          >
            <span>{currentIndex === questions.length - 1 ? (submitting ? 'Scoring...' : 'Finish Assessment') : 'Next Question'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
