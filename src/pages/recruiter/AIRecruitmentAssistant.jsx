import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Send, 
  Plus, 
  MessageSquare, 
  Database, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  FileCode, 
  RefreshCw,
  Search,
  BookOpen,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Code2,
  Target
} from 'lucide-react';

export default function AIRecruitmentAssistant() {
  // Chat state
  const [conversationId, setConversationId] = useState(() => {
    let saved = localStorage.getItem('smarthire_rag_conversation_id');
    if (!saved) {
      saved = crypto.randomUUID();
      localStorage.setItem('smarthire_rag_conversation_id', saved);
    }
    return saved;
  });

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Document ingestion state
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // 'Uploading' | 'Extracting' | 'Chunking' | 'Embedding' | 'Indexed'
  const [uploadDocType, setUploadDocType] = useState('RESUME');
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [expandedSources, setExpandedSources] = useState({});

  // Voice Input (Microphone) & Voice Output (Speaker)
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const recognitionRef = useRef(null);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        const spokenText = finalTranscript || interimTranscript;
        if (spokenText) {
          setMessage(spokenText);
        }
        if (finalTranscript && finalTranscript.trim()) {
          handleSendMessage(finalTranscript.trim());
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not available in this browser. Please use Chrome, Safari, or Microsoft Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setMessage('');
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Could not start microphone:', err);
      }
    }
  };

  const speakText = (text, idx) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_>`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    loadDocuments();
    loadConversations();
    loadChatMessages(conversationId);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadDocuments = async () => {
    try {
      const docs = await api.getAiDocuments();
      if (docs) setDocuments(docs);
    } catch (err) {
      console.warn('Could not load documents:', err);
    }
  };

  const loadConversations = async () => {
    try {
      const convs = await api.getAiConversations();
      if (convs) setConversations(convs);
    } catch (err) {
      console.warn('Could not load conversations:', err);
    }
  };

  const loadChatMessages = async (cid) => {
    try {
      const msgs = await api.getAiConversationMessages(cid);
      if (msgs && msgs.length > 0) {
        setMessages(msgs);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.warn('Could not load conversation messages:', err);
      setMessages([]);
    }
  };

  const startNewConversation = () => {
    const newId = crypto.randomUUID();
    localStorage.setItem('smarthire_rag_conversation_id', newId);
    setConversationId(newId);
    setMessages([]);
  };

  const handleDeleteConversation = async (e, cid) => {
    e.stopPropagation();
    try {
      await api.deleteAiConversation(cid);
      setConversations(conversations.filter(c => c.conversationId !== cid));
      if (cid === conversationId) {
        startNewConversation();
      }
    } catch (err) {
      console.error('Delete conversation error:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress('Extracting & Chunking...');

    try {
      const res = await api.uploadAiDocument(file, uploadDocType);
      setUploadProgress('Indexed in Vector Store!');
      setTimeout(() => setUploadProgress(null), 3000);
      loadDocuments();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed: ' + (err.message || 'Please check file format.'));
      setUploadProgress(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Delete this document and purge its vector embeddings?')) return;
    try {
      await api.deleteAiDocument(id);
      setDocuments(documents.filter(d => d.id !== id));
    } catch (err) {
      console.error('Delete document failed:', err);
    }
  };

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || message;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: textToSend,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setMessage('');
    setLoading(true);

    try {
      const res = await api.sendAiChat(textToSend, conversationId, selectedDocId);
      const aiMsg = {
        role: 'assistant',
        content: res.response,
        sources: res.sources || [],
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
      loadConversations();
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an issue retrieving context or contacting Gemini. Please verify your backend and vector store configuration.',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSourceView = (idx) => {
    setExpandedSources(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const suggestedQuestions = [
    "Summarize this candidate's core qualifications",
    "What are the candidate's verified technical skills?",
    "How many years of relevant experience are evidenced?",
    "Does this resume mention experience with Spring Boot and React?",
    "Compare candidate qualifications with the uploaded Job Description",
    "What key qualifications from the JD are missing in the resume?"
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge-pill badge-blue" style={{ marginBottom: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} /> Spring AI + Gemini + Pinecone RAG
            </span>
            <h1 className="section-title" style={{ fontSize: '2.1rem', marginBottom: '0.3rem' }}>
              AI Recruitment Intelligence
            </h1>
            <p className="section-subtitle" style={{ margin: 0, fontSize: '0.95rem' }}>
              Upload resumes & job descriptions, retrieve verified evidence, and query candidates with persistent memory.
            </p>
          </div>

          {/* Architecture Status Badges */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.65rem', borderRadius: '20px', backgroundColor: '#E6F4EA', color: '#137333', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Cpu size={12} /> Spring Boot 3.2
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.65rem', borderRadius: '20px', backgroundColor: '#E8F0FE', color: '#1A73E8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={12} /> Google Gemini AI
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.65rem', borderRadius: '20px', backgroundColor: '#F3E8FD', color: '#8430CE', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Layers size={12} /> Pinecone 768-D
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.65rem', borderRadius: '20px', backgroundColor: '#FEF7E0', color: '#B06000', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Database size={12} /> MySQL Chat Memory
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Document Manager (Left) + RAG Chat Panel (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Document Hub & Ingestion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Upload Card */}
          <div className="apple-card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UploadCloud size={18} color="#0071E3" /> Document Ingestion
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#6E6E73', marginBottom: '1.2rem', lineHeight: 1.4 }}>
              Upload candidate resumes or job descriptions. Text is extracted with PDFBox, split into overlapping chunks, and indexed into the vector store.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '0.3rem', display: 'block' }}>
                Document Category
              </label>
              <select
                value={uploadDocType}
                onChange={(e) => setUploadDocType(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '10px', border: '1px solid #D2D2D7', fontSize: '0.85rem', backgroundColor: '#FBFBFD' }}
              >
                <option value="RESUME">Candidate Resume (PDF)</option>
                <option value="JOB_DESCRIPTION">Job Description / Requirements</option>
                <option value="GENERAL">Recruitment Policy / Notes</option>
              </select>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.txt"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                border: '2px dashed #0071E3',
                backgroundColor: '#F0F7FF',
                color: '#0071E3',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
            >
              <UploadCloud size={18} />
              <span>{uploading ? 'Processing PDF with PDFBox...' : 'Choose PDF to Ingest'}</span>
            </button>

            {uploadProgress && (
              <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.9rem', borderRadius: '10px', backgroundColor: '#E6F4EA', color: '#137333', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} /> {uploadProgress}
              </div>
            )}
          </div>

          {/* Uploaded Documents List */}
          <div className="apple-card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Database size={16} color="#0071E3" /> Indexed Documents ({documents.length})
              </h3>
              <button onClick={loadDocuments} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#86868B', padding: '4px' }}>
                <RefreshCw size={14} />
              </button>
            </div>

            {documents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#86868B', fontSize: '0.85rem' }}>
                <FileText size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                No documents indexed yet. Upload a candidate resume to enable RAG.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '360px', overflowY: 'auto' }}>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '12px',
                      backgroundColor: selectedDocId === doc.documentId ? '#F0F7FF' : '#F9F9FB',
                      border: `1px solid ${selectedDocId === doc.documentId ? '#0071E3' : '#E5E5EA'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                        <FileCode size={16} color="#0071E3" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1D1D1F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {doc.filename}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        title="Delete document & vectors"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF3B30', padding: 0 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem', color: '#6E6E73' }}>
                      <span style={{ backgroundColor: doc.docType === 'RESUME' ? '#E1F0FF' : '#FFF0E6', color: doc.docType === 'RESUME' ? '#0055B3' : '#B34700', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                        {doc.docType}
                      </span>
                      <span>{doc.chunkCount || 1} chunks</span>
                      <span>•</span>
                      <span style={{ color: doc.status === 'INDEXED' ? '#10B981' : '#F59E0B', fontWeight: 600 }}>
                        ● {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conversations History Sidebar Widget */}
          <div className="apple-card" style={{ padding: '1.2rem', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#86868B', textTransform: 'uppercase' }}>
                Saved Chats (MySQL)
              </span>
              <button
                onClick={startNewConversation}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#0071E3',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} /> New Chat
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
              {conversations.map((c) => (
                <div
                  key={c.conversationId}
                  onClick={() => {
                    setConversationId(c.conversationId);
                    localStorage.setItem('smarthire_rag_conversation_id', c.conversationId);
                  }}
                  style={{
                    padding: '0.55rem 0.75rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: c.conversationId === conversationId ? '#0071E3' : '#F5F5F7',
                    color: c.conversationId === conversationId ? '#FFFFFF' : '#1D1D1F',
                    fontWeight: c.conversationId === conversationId ? 600 : 500
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                    <MessageSquare size={13} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {c.title || 'Candidate Chat'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(e, c.conversationId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: c.conversationId === conversationId ? '#FFFFFF' : '#86868B',
                      opacity: 0.8
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RAG Chat Assistant */}
        <div 
          className="apple-card" 
          style={{ 
            height: '750px', 
            display: 'flex', 
            flexDirection: 'column', 
            backgroundColor: '#FFFFFF', 
            borderRadius: '24px', 
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}
        >
          {/* Chat Header */}
          <div style={{ padding: '1.2rem 1.8rem', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #0071E3 0%, #8656EF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', boxShadow: '0 4px 12px rgba(0, 113, 227, 0.25)' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#1D1D1F' }}>
                  SmartHire Recruitment RAG Co-Pilot
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                  Real AI Assistant Active • Solves Doubts & RAG
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {selectedDocId && (
                <button
                  onClick={() => setSelectedDocId(null)}
                  style={{ fontSize: '0.75rem', color: '#86868B', background: '#F5F5F7', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Clear Doc Filter
                </button>
              )}
              <button
                onClick={startNewConversation}
                className="btn-apple"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Plus size={14} /> New Chat
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', backgroundColor: '#FBFBFD' }}>
            {messages.length === 0 && !loading ? (
              <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '520px', padding: '2rem 1rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', backgroundColor: '#F0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                  <BookOpen size={28} color="#0071E3" />
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1D1D1F', marginBottom: '0.5rem' }}>
                  Recruitment Document Q&A
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#6E6E73', marginBottom: '1.8rem', lineHeight: 1.5 }}>
                  Ask questions about any candidate's resume or job description. Responses are retrieved from vector embeddings and verified by Gemini.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                  {/* Category 1: Technical & CS Doubts */}
                  <div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0071E3', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                      <Code2 size={13} /> Trained: Programming & Architecture Doubts
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      {[
                        "What is JSON and how is it used in web apps?",
                        "Explain Spring Boot Dependency Injection with code",
                        "How do Java 21 Virtual Threads work?",
                        "Explain React Virtual DOM and Hook lifecycle"
                      ].map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(q)}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '10px',
                            border: '1px solid #E5E5EA',
                            backgroundColor: '#FFFFFF',
                            color: '#1D1D1F',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0F7FF'; e.currentTarget.style.borderColor = '#0071E3'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#E5E5EA'; }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 2: ATS & Career Coaching */}
                  <div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                      <Target size={13} /> Trained: ATS & Interview Coaching
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      {[
                        "How to optimize resume for 90+ ATS score?",
                        "Explain the STAR method for behavioral interviews"
                      ].map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(q)}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '10px',
                            border: '1px solid #E5E5EA',
                            backgroundColor: '#FFFFFF',
                            color: '#1D1D1F',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ECFDF5'; e.currentTarget.style.borderColor = '#10B981'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#E5E5EA'; }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 3: Document RAG Intelligence */}
                  <div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                      <FileText size={13} /> Trained: Document & Candidate Analysis
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      {[
                        "Summarize candidate's verified qualifications",
                        "Extract all technical skills from this resume",
                        "How many years of experience are evidenced?",
                        "Compare candidate against the Job Description"
                      ].map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(q)}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '10px',
                            border: '1px solid #E5E5EA',
                            backgroundColor: '#FFFFFF',
                            color: '#1D1D1F',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F3FF'; e.currentTarget.style.borderColor = '#8B5CF6'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#E5E5EA'; }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((m, idx) => {
                const isUser = m.role === 'user';
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                      width: '100%'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '82%',
                        padding: '1rem 1.25rem',
                        borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        backgroundColor: isUser ? '#0071E3' : '#FFFFFF',
                        color: isUser ? '#FFFFFF' : '#1D1D1F',
                        boxShadow: isUser ? '0 4px 14px rgba(0, 113, 227, 0.25)' : '0 2px 10px rgba(0,0,0,0.04)',
                        border: isUser ? 'none' : '1px solid rgba(0,0,0,0.06)',
                        lineHeight: 1.6,
                        fontSize: '0.92rem'
                      }}
                    >
                      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {m.content}
                      </div>

                      {/* Assistant Actions: Audio Playback & Sources */}
                      {!isUser && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.6rem' }}>
                          {m.sources && m.sources.length > 0 ? (
                            <button
                              onClick={() => toggleSourceView(idx)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#0071E3',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: 0
                              }}
                            >
                              <span>{m.sources.length} Verified Document Sources</span>
                              {expandedSources[idx] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          ) : <div />}

                          <button
                            onClick={() => speakText(m.content, idx)}
                            title={speakingIdx === idx ? "Stop audio" : "Listen to answer read aloud"}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: speakingIdx === idx ? '#FF3B30' : '#86868B',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              padding: '2px 6px',
                              borderRadius: '6px'
                            }}
                          >
                            {speakingIdx === idx ? (
                              <>
                                <VolumeX size={15} />
                                <span>Stop Audio</span>
                              </>
                            ) : (
                              <>
                                <Volume2 size={15} />
                                <span>Read Aloud</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Source Citations Expanded View */}
                      {!isUser && expandedSources[idx] && m.sources && m.sources.length > 0 && (
                        <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {m.sources.map((s, sIdx) => (
                            <div
                              key={sIdx}
                              style={{
                                padding: '0.5rem 0.75rem',
                                borderRadius: '8px',
                                backgroundColor: '#F5F5F7',
                                fontSize: '0.76rem',
                                border: '1px solid #E5E5EA'
                              }}
                            >
                              <div style={{ fontWeight: 600, color: '#1D1D1F', display: 'flex', justifyContent: 'space-between' }}>
                                <span>📄 {s.filename} (Chunk {s.chunkIndex})</span>
                                <span style={{ color: '#0071E3' }}>{Math.round(s.similarityScore * 100)}% match</span>
                              </div>
                              <div style={{ color: '#6E6E73', marginTop: '0.2rem', fontStyle: 'italic' }}>
                                "{s.textSnippet}"
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', borderRadius: '16px', backgroundColor: '#FFFFFF', alignSelf: 'flex-start', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #E5E5EA', borderTopColor: '#0071E3', animation: 'spinSlow 0.8s linear infinite' }}></div>
                <span style={{ fontSize: '0.85rem', color: '#6E6E73' }}>
                  Retrieving vector chunks and synthesizing grounded answer...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar with Live Mic Button */}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#FFFFFF' }}>
            {isListening && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', padding: '0.45rem 0.9rem', backgroundColor: '#FFF0F0', borderRadius: '10px', color: '#D32F2F', fontSize: '0.82rem', fontWeight: 600, border: '1px solid #FFCDD2' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D32F2F', animation: 'spinSlow 1s infinite' }}></span>
                <span>🔴 Listening to your voice... Speak your recruitment question (will auto-analyze and answer when you stop)</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isListening ? "Listening to your voice..." : "Ask any question, solve doubts (e.g. JSON, Spring Boot, DSA), or analyze documents..."}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.85rem 1.2rem',
                  borderRadius: '16px',
                  border: isListening ? '2px solid #FF3B30' : '1px solid #D2D2D7',
                  fontSize: '0.92rem',
                  outline: 'none',
                  backgroundColor: '#FBFBFD',
                  transition: 'border 0.2s ease'
                }}
              />

              {/* Voice Microphone Button */}
              <button
                type="button"
                onClick={toggleMic}
                title={isListening ? "Stop listening" : "Click to speak with microphone"}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  border: isListening ? '2px solid #FF3B30' : '1px solid #D2D2D7',
                  backgroundColor: isListening ? '#FF3B30' : '#F5F5F7',
                  color: isListening ? '#FFFFFF' : '#1D1D1F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: isListening ? '0 0 16px rgba(255, 59, 48, 0.5)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !message.trim()}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: loading || !message.trim() ? '#D2D2D7' : '#0071E3',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: loading || !message.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 113, 227, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Send size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.74rem', color: '#86868B' }}>
              <span>Click <strong>Mic</strong> to speak • Press <strong>Enter</strong> to send</span>
              <span>Voice & RAG Memory: Active</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
