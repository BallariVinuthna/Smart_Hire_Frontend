import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Compass, CheckCircle2, Clock, Circle, ArrowRight, ChevronRight, BookOpen } from 'lucide-react';

export default function CareerRoadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      const data = await api.getRoadmap();
      setRoadmap(data);
      if (data?.nodes && data.nodes.length > 0) {
        setSelectedNode(data.nodes[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (node) => {
    const nextStatus = node.status === 'COMPLETED' ? 'IN_PROGRESS' : node.status === 'IN_PROGRESS' ? 'UPCOMING' : 'COMPLETED';
    try {
      await api.updateRoadmapNodeStatus(node.id, nextStatus);
      loadRoadmap();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#6E6E73' }}>
        Building personalized career roadmap...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
        <span className="badge-pill badge-blue" style={{ marginBottom: '1rem' }}>
          <Compass size={14} /> Milestone Sequence
        </span>
        <h1 className="section-title" style={{ marginBottom: '0.8rem' }}>
          Interactive Career Roadmap
        </h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Know exactly what to do next to transition from current evidence to your target offer.
        </p>
      </div>

      {/* Horizontal Scrolling Milestone Track */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid rgba(0,0,0,0.06)',
          padding: '2.5rem 1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          marginBottom: '2.5rem',
          overflowX: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', minWidth: '950px', padding: '1rem 0' }}>
          {roadmap?.nodes?.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            const isDone = node.status === 'COMPLETED';
            const isInProg = node.status === 'IN_PROGRESS';

            return (
              <React.Fragment key={node.id}>
                {/* Milestone Node Card */}
                <div
                  onClick={() => setSelectedNode(node)}
                  style={{
                    padding: '1.2rem 1.4rem',
                    borderRadius: '18px',
                    border: isSelected ? '2px solid #0071E3' : '1px solid rgba(0,0,0,0.08)',
                    backgroundColor: isSelected ? 'rgba(0,113,227,0.04)' : '#F5F5F7',
                    minWidth: '220px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 20px rgba(0,113,227,0.15)' : 'none',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#86868B' }}>
                      STEP {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: isDone ? '#10B981' : isInProg ? '#0071E3' : '#86868B'
                      }}
                    >
                      {isDone ? '✓ DONE' : isInProg ? 'IN PROGRESS' : 'UPCOMING'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1D1D1F', marginBottom: '0.3rem', lineHeight: 1.3 }}>
                    {node.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#6E6E73' }}>
                    {node.estimatedTime}
                  </div>
                </div>

                {/* Connector arrow */}
                {index < roadmap.nodes.length - 1 && (
                  <ArrowRight size={20} color="#C7C7CC" style={{ flexShrink: 0 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Expanded Node Detail View */}
      {selectedNode && (
        <div className="apple-card" style={{ padding: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span className="badge-pill badge-blue" style={{ marginBottom: '0.6rem' }}>
                Milestone Drilldown
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{selectedNode.title}</h2>
              <div style={{ fontSize: '1rem', color: '#6E6E73', marginTop: '0.2rem' }}>{selectedNode.subtitle}</div>
            </div>

            <button
              onClick={() => handleToggleStatus(selectedNode)}
              className="btn-apple btn-apple-secondary"
              style={{ fontSize: '0.88rem' }}
            >
              Status: {selectedNode.status} (Click to toggle)
            </button>
          </div>

          <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#2C2C2E', marginBottom: '2rem' }}>
            {selectedNode.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#6E6E73', marginBottom: '0.5rem' }}>
                Competency Targets
              </h4>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1D1D1F' }}>
                {selectedNode.keySkills}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#6E6E73', marginBottom: '0.5rem' }}>
                Recommended Production Tasks
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#48484A' }}>
                Push capstone code to GitHub and verify through an adaptive quiz to auto-complete this milestone.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
