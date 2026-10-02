import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  GitBranch, 
  GitPullRequest, 
  Star, 
  GitFork, 
  CheckCircle2, 
  Code2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  User, 
  Lock, 
  Globe, 
  FolderGit2, 
  Activity,
  Layers
} from 'lucide-react';

export default function GitHubAnalysis() {
  const [gitData, setGitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [inputUsername, setInputUsername] = useState('BallariVinuthna');

  useEffect(() => {
    // Check for OAuth callback code in URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      handleOAuthCallback(code);
    } else {
      loadGitHubData();
    }
  }, []);

  const handleOAuthCallback = async (code) => {
    setLoading(true);
    setError(null);
    try {
      // Clear code from URL without full refresh
      window.history.replaceState({}, document.title, window.location.pathname);
      const data = await api.connectGitHubCode(code);
      setGitData(data);
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError(err.message || 'Failed to authorize GitHub account.');
    } finally {
      setLoading(false);
    }
  };

  const loadGitHubData = async () => {
    setLoading(true);
    setError(null);
    try {
      // First check connection status & load analytics if connected
      const status = await api.getGitHubStatus();
      if (status.connected && status.username) {
        const data = await api.getGitHubAnalytics();
        setGitData(data);
      } else {
        // Not connected: set null gitData
        setGitData(null);
      }
    } catch (err) {
      console.error('Error loading GitHub data:', err);
      setError('Could not fetch GitHub data. Please try again.');
      setGitData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const authResp = await api.getGitHubAuthUrl();
      if (authResp.authUrl) {
        window.location.href = authResp.authUrl;
      } else {
        // If OAuth credentials not configured on backend, fall back to username connection
        await handleUsernameConnect();
      }
    } catch (err) {
      console.error('OAuth redirect error, falling back to username connection:', err);
      await handleUsernameConnect();
    } finally {
      setConnecting(false);
    }
  };

  const handleUsernameConnect = async (e) => {
    if (e) e.preventDefault();
    if (!inputUsername || !inputUsername.trim()) {
      setError('Please enter a valid GitHub username.');
      return;
    }

    setConnecting(true);
    setError(null);
    try {
      const data = await api.connectGitHubUsername(inputUsername.trim());
      setGitData(data);
    } catch (err) {
      console.error('Username connection error:', err);
      setError(err.message || `Could not connect GitHub account '${inputUsername}'. Please verify username.`);
    } finally {
      setConnecting(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const data = await api.refreshGitHubData();
      setGitData(data);
    } catch (err) {
      console.error('Error refreshing GitHub data:', err);
      setError('Failed to refresh GitHub data.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect your GitHub account?')) return;
    setLoading(true);
    try {
      await api.disconnectGitHub();
      setGitData(null);
    } catch (err) {
      console.error('Error disconnecting GitHub:', err);
      setError('Failed to disconnect GitHub account.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', padding: '6rem 0' }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '3px solid rgba(0, 113, 227, 0.2)',
          borderTopColor: '#0071E3',
          borderRadius: '50%',
          animation: 'spin 1s infinite linear',
          marginBottom: '1.5rem'
        }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1D1D1F' }}>
          Connecting to GitHub...
        </h3>
        <p style={{ color: '#6E6E73', fontSize: '0.95rem', marginTop: '0.4rem' }}>
          Analyzing repositories, commit velocity, and language proficiency...
        </p>
      </div>
    );
  }

  // 2. Disconnected State
  if (!gitData || !gitData.connected) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge-pill badge-dark" style={{ marginBottom: '1rem' }}>
            <GitBranch size={14} /> Technical Portfolio Audit
          </span>
          <h1 className="section-title" style={{ marginBottom: '0.8rem' }}>
            Your code tells a story.
          </h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Connect your GitHub account to analyze real repositories, multi-branch commit cadence, and language proficiency.
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            backgroundColor: '#FFEEEE',
            border: '1px solid #FFCACC',
            borderRadius: '16px',
            color: '#D32F2F',
            fontSize: '0.9rem',
            marginBottom: '2rem'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Disconnected Card */}
        <div className="apple-card" style={{ padding: '3rem 2.5rem', textAlign: 'center' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '24px',
            backgroundColor: '#F5F5F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <FolderGit2 size={36} color="#1D1D1F" />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1D1D1F', marginBottom: '0.6rem' }}>
            GitHub Not Connected
          </h2>
          <p style={{ color: '#6E6E73', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 2rem auto', lineHeight: '1.5' }}>
            Connect your real GitHub account to generate live evidence-backed portfolio metrics. Zero fake statistics.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '440px', margin: '0 auto' }}>
            {/* Primary OAuth Button */}
            <button
              onClick={handleOAuthConnect}
              disabled={connecting}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                backgroundColor: '#24292E',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: connecting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              <GitBranch size={18} />
              {connecting ? 'Redirecting to GitHub...' : 'Connect GitHub Account'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#86868B', fontSize: '0.82rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#EFEFEF' }} />
              <span>OR CONNECT BY USERNAME</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#EFEFEF' }} />
            </div>

            {/* Quick Username Input Form */}
            <form onSubmit={handleUsernameConnect} style={{ display: 'flex', gap: '0.6rem' }}>
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="Enter GitHub Username (e.g. BallariVinuthna)"
                disabled={connecting}
                style={{
                  flex: 1,
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid #D2D2D7',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              />
              <button
                type="submit"
                disabled={connecting}
                style={{
                  padding: '0.85rem 1.4rem',
                  backgroundColor: '#0071E3',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: connecting ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {connecting ? 'Connecting...' : 'Connect'}
              </button>
            </form>
          </div>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #EFEFEF', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.82rem', color: '#86868B' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#10B981" /> OAuth Token Security
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="#0071E3" /> Dynamic Live Updates
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Connected Dashboard State
  const repositories = gitData.repositories || [];
  const languages = gitData.languages || {};

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge-pill badge-dark" style={{ marginBottom: '1rem' }}>
          <GitBranch size={14} /> Technical Portfolio Audit
        </span>
        <h1 className="section-title" style={{ marginBottom: '0.8rem' }}>
          Your code tells a story.
        </h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Live API analysis of repository architecture, commit cadence, and language proficiency.
        </p>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#FFEEEE',
          border: '1px solid #FFCACC',
          borderRadius: '16px',
          color: '#D32F2F',
          fontSize: '0.9rem',
          marginBottom: '2rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* GitHub Profile Card */}
      <div className="apple-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src={gitData.avatarUrl || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}
              alt={gitData.displayName || gitData.username}
              style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F5F5F7' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1D1D1F' }}>
                  {gitData.displayName || gitData.username}
                </h2>
                <span className="badge-pill badge-success" style={{ fontSize: '0.75rem' }}>Connected</span>
              </div>
              <p style={{ color: '#0071E3', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.1rem' }}>
                @{gitData.username}
              </p>
              {gitData.bio && (
                <p style={{ color: '#6E6E73', fontSize: '0.88rem', marginTop: '0.3rem', maxWidth: '500px' }}>
                  {gitData.bio}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href={gitData.htmlUrl || `https://github.com/${gitData.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-card-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1rem',
                backgroundColor: '#F5F5F7',
                borderRadius: '10px',
                color: '#1D1D1F',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={14} /> View GitHub Profile
            </a>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1rem',
                backgroundColor: '#0071E3',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: refreshing ? 'not-allowed' : 'pointer'
              }}
            >
              <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh GitHub Data'}
            </button>

            <button
              onClick={handleDisconnect}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 0.9rem',
                backgroundColor: 'transparent',
                color: '#FF3B30',
                border: '1px solid rgba(255, 59, 48, 0.3)',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <LogOut size={14} /> Disconnect
            </button>
          </div>
        </div>

        {/* Profile Metrics Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #EFEFEF',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: '#86868B', display: 'block', fontSize: '0.78rem' }}>Repositories</span>
            <strong style={{ color: '#1D1D1F', fontSize: '1.1rem' }}>{gitData.repositoriesCount}</strong>
          </div>
          <div>
            <span style={{ color: '#86868B', display: 'block', fontSize: '0.78rem' }}>Followers</span>
            <strong style={{ color: '#1D1D1F', fontSize: '1.1rem' }}>{gitData.followers}</strong>
          </div>
          <div>
            <span style={{ color: '#86868B', display: 'block', fontSize: '0.78rem' }}>Following</span>
            <strong style={{ color: '#1D1D1F', fontSize: '1.1rem' }}>{gitData.following}</strong>
          </div>
          <div>
            <span style={{ color: '#86868B', display: 'block', fontSize: '0.78rem' }}>Public Repos</span>
            <strong style={{ color: '#1D1D1F', fontSize: '1.1rem' }}>{gitData.publicRepositoriesCount}</strong>
          </div>
          {gitData.location && (
            <div>
              <span style={{ color: '#86868B', display: 'block', fontSize: '0.78rem' }}>Location</span>
              <strong style={{ color: '#1D1D1F' }}>{gitData.location}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Overview Stat Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="apple-card" style={{ textAlign: 'center', padding: '1.8rem 1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Repositories</span>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#1D1D1F', margin: '0.2rem 0' }}>
            {gitData.repositoriesCount}
          </div>
          <span style={{ fontSize: '0.82rem', color: '#0071E3', fontWeight: 600 }}>
            {gitData.publicRepositoriesCount} Public &bull; {gitData.forkedRepositoriesCount} Forked
          </span>
        </div>

        <div className="apple-card" style={{ textAlign: 'center', padding: '1.8rem 1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Languages</span>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#8656EF', margin: '0.2rem 0' }}>
            {gitData.languagesCount}
          </div>
          <span style={{ fontSize: '0.82rem', color: '#8656EF', fontWeight: 600 }}>
            Primary: {gitData.primaryLanguage}
          </span>
        </div>

        <div className="apple-card" style={{ textAlign: 'center', padding: '1.8rem 1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Projects Analyzed</span>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#06B6D4', margin: '0.2rem 0' }}>
            {gitData.originalRepositoriesCount}
          </div>
          <span style={{ fontSize: '0.82rem', color: '#06B6D4', fontWeight: 600 }}>Original Repositories</span>
        </div>

        <div className="apple-card" style={{ textAlign: 'center', padding: '1.8rem 1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#6E6E73', textTransform: 'uppercase', fontWeight: 600 }}>Recent Activity</span>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: gitData.recentActivity === 'Active' ? '#10B981' : '#F59E0B', margin: '0.5rem 0' }}>
            {gitData.recentActivity}
          </div>
          <span style={{ fontSize: '0.82rem', color: gitData.recentActivity === 'Active' ? '#10B981' : '#F59E0B', fontWeight: 600, display: 'block' }}>
            {gitData.commitStreakText}
          </span>
        </div>
      </div>

      {/* Language Distribution */}
      <div className="apple-card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Code2 size={20} color="#8656EF" /> Language Distribution
        </h3>
        
        {Object.keys(languages).length === 0 ? (
          <p style={{ color: '#6E6E73', fontSize: '0.9rem' }}>No language statistics available for repositories.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(languages).map(([lang, pct], idx) => {
              const colors = ['#0071E3', '#8656EF', '#06B6D4', '#10B981', '#F59E0B', '#EC4899'];
              const barColor = colors[idx % colors.length];
              return (
                <div key={lang}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                    <strong style={{ color: '#1D1D1F' }}>{lang}</strong>
                    <span style={{ color: '#6E6E73', fontWeight: 600 }}>{pct}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#EFEFEF', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: barColor,
                      borderRadius: '999px',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Real Repositories List */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1D1D1F' }}>
          Repositories ({repositories.length})
        </h3>
        <span style={{ fontSize: '0.85rem', color: '#6E6E73' }}>
          Real GitHub API Data &bull; Auto-Synced
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
        {repositories.length === 0 ? (
          <div className="apple-card" style={{ padding: '2rem', textAlign: 'center', color: '#6E6E73' }}>
            No repositories found for this account.
          </div>
        ) : (
          repositories.map((repo) => (
            <div key={repo.name} className="apple-card" style={{ padding: '1.75rem 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0071E3', textDecoration: 'none' }}
                      >
                        {repo.name}
                      </a>
                    </h4>
                    {repo.isPrivate && (
                      <span className="badge-pill badge-dark" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Lock size={10} /> Private
                      </span>
                    )}
                    {repo.isFork && (
                      <span className="badge-pill badge-dark" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <GitFork size={10} /> Fork
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#48484A', marginTop: '0.35rem', lineHeight: '1.4' }}>
                    {repo.description}
                  </p>
                </div>

                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-card-hover"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.82rem',
                    color: '#0071E3',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  View Repo <ExternalLink size={12} />
                </a>
              </div>

              <div style={{
                display: 'flex',
                gap: '1.5rem',
                fontSize: '0.84rem',
                color: '#6E6E73',
                borderTop: '1px solid rgba(0,0,0,0.06)',
                paddingTop: '0.85rem',
                marginTop: '1rem',
                flexWrap: 'wrap'
              }}>
                <span>Language: <strong style={{ color: '#1D1D1F' }}>{repo.language}</strong></span>
                <span>⭐ <strong>{repo.stars}</strong> stars</span>
                <span>🍴 <strong>{repo.forks}</strong> forks</span>
                <span>Branch: <strong style={{ color: '#1D1D1F' }}>{repo.defaultBranch}</strong></span>
                {repo.updatedAt && (
                  <span>Updated: <strong>{new Date(repo.updatedAt).toLocaleDateString()}</strong></span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '1.2rem', backgroundColor: '#F5F5F7', borderRadius: '16px', fontSize: '0.85rem', color: '#6E6E73' }}>
        <AlertCircle size={18} color="#86868B" style={{ flexShrink: 0 }} />
        <span>* SmartHire X evaluates live GitHub activity solely as supporting project proof, not as sole determinant of engineering competence.</span>
      </div>
    </div>
  );
}
