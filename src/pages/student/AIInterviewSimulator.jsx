import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { Mic, MicOff, Volume2, ArrowRight, CheckCircle2, Award, Cpu, Sparkles, RefreshCw } from 'lucide-react';

export default function AIInterviewSimulator() {
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initInterview();
  }, []);

  const initInterview = async () => {
    try {
      setLoading(true);
      setError(null);
      setEvaluation(null);
      setCurrentIndex(0);
      setTranscript('');
      setQuestions([]);
      const started = await api.startInterview('Java Full Stack Engineer');
      setInterview(started);
      const qList = await api.getInterviewQuestions(started.id);
      if (!qList || qList.length === 0) {
        setError('No questions loaded. Please try again.');
      } else {
        setQuestions(qList);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to start interview session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];

  const speakQuestion = () => {
    if ('speechSynthesis' in window && currentQ) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQ.questionText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          setTranscript(prev => (prev ? prev + ' ' : '') + text);
          setIsRecording(false);
        };
        recognition.onerror = () => {
          setIsRecording(false);
          // Do NOT auto-fill a fake answer — leave textarea empty so user types manually
        };
        recognition.onend = () => setIsRecording(false);
        recognition.start();
      } catch (e) {
        // Speech API unavailable — user must type their answer
        setIsRecording(false);
      }
    } else {
      // Web Speech not supported — do NOT auto-fill a fake transcript
      setIsRecording(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!currentQ || !interview) return;
    setSubmitting(true);
    try {
      await api.submitInterviewAnswer(
        interview.id,
        currentQ.id,
        transcript,   // send actual answer — empty string if not answered
        null
      );

      setTranscript('');

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const report = await api.completeInterview(interview.id);
        setEvaluation(report);
        if (report && report.overallScore > 0) {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        }
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong submitting your answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '8rem 0', color: '#6E6E73' }}>
        Initializing AI Interview Room &amp; Speech Engine...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div style={{ fontSize: '1.1rem', color: '#EF4444', marginBottom: '1.5rem' }}>{error}</div>
        <button onClick={initInterview} className="btn-apple btn-apple-primary">
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // Final Results Screen
  if (evaluation) {
    return (
      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div className="apple-card" style={{ padding: '3.5rem 3rem', textAlign: 'center' }}>
          <span className="badge-pill badge-blue" style={{ marginBottom: '1rem' }}>
            Simulation Complete
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
            Interview Readiness
          </h1>

          <div style={{ fontSize: '5rem', fontWeight: 800, color: '#1D1D1F', letterSpacing: '-0.05em', lineHeight: 1, margin: '1rem 0' }}>
            {evaluation.accuracy || 0}%
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#6E6E73', marginBottom: '2rem' }}>
            Accuracy
          </div>

          <p style={{ color: '#6E6E73', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            {evaluation.feedback}
          </p>

          {/* Answer Status Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { label: 'Total Questions', val: evaluation.totalQuestions || 5, color: '#1D1D1F' },
              { label: 'Attempted', val: evaluation.attempted || 0, color: '#0071E3' },
              { label: 'Correct', val: evaluation.correct || 0, color: '#10B981' },
              { label: 'Wrong', val: evaluation.wrong || 0, color: '#EF4444' },
              { label: 'Unattempted', val: evaluation.unattempted || 0, color: '#8656EF' },
              { label: 'Accuracy', val: `${evaluation.accuracy || 0}%`, color: '#F59E0B' }
            ].map((d) => (
              <div key={d.label} style={{ padding: '1.2rem', backgroundColor: '#F5F5F7', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: d.color, marginBottom: '0.2rem' }}>
                  {d.val}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#48484A' }}>{d.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={initInterview} className="btn-apple btn-apple-secondary">
              <RefreshCw size={16} />
              <span>Practice Another Round</span>
            </button>
            <a href="/student/readiness" className="btn-apple btn-apple-primary">
              <span>View Global Readiness</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  const progressNum = String(currentIndex + 1).padStart(2, '0');
  const totalNum = String(questions.length).padStart(2, '0');

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 10px #10B981' }}></div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            LIVE AI INTERVIEW ROOM
          </span>
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#6E6E73' }}>
          Question {progressNum} / {totalNum}
        </div>
      </div>

      {/* Main Studio Frame */}
      <div className="apple-card" style={{ padding: '3.5rem 2.5rem', textAlign: 'center' }}>
        {/* Animated AI Avatar */}
        <div
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #252530 0%, #0D0D10 100%)',
            border: '2px solid rgba(0, 113, 227, 0.4)',
            boxShadow: '0 0 45px rgba(0, 113, 227, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2.5rem',
            position: 'relative'
          }}
          className="animate-glow"
        >
          <Cpu size={56} color="#0071E3" />
        </div>

        {/* Question Prompt */}
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.35, color: '#1D1D1F', maxWidth: '680px', margin: '0 auto 1.5rem' }}>
          "{currentQ?.questionText}"
        </h2>

        {/* Speak Audio Prompt Trigger */}
        <button
          onClick={speakQuestion}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'none',
            border: 'none',
            color: '#0071E3',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '2.5rem'
          }}
        >
          <Volume2 size={16} />
          <span>Listen to AI Audio</span>
        </button>

        {/* Transcript / Input Area */}
        <div style={{ maxWidth: '640px', margin: '0 auto 2rem', textAlign: 'left' }}>
          <label className="apple-label">Your Answer (Voice Speech or Typed Articulation)</label>
          <textarea
            className="apple-input"
            rows={4}
            placeholder="Click [ Speak ] or articulate your solution here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        </div>

        {/* Speech Controls & Next Action */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          <button
            onClick={toggleRecording}
            className="btn-apple"
            style={{
              backgroundColor: isRecording ? '#EF4444' : '#1D1D1F',
              color: '#FFFFFF',
              padding: '0.9rem 2rem',
              fontSize: '1rem'
            }}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            <span>{isRecording ? 'Listening...' : '[ Speak ]'}</span>
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={submitting}
            className="btn-apple btn-apple-primary"
            style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}
          >
            <span>{currentIndex === questions.length - 1 ? (submitting ? 'Evaluating...' : 'Finish Simulation') : 'Next Question'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
