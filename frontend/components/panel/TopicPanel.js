import { useState, useEffect, useRef } from 'react';
import { getTopicById } from '../../utils/api';

const CAT_META = {
  science:     { color: '#4af0d0', icon: '🔬', label: 'Science'      },
  technology:  { color: '#4a9eff', icon: '💻', label: 'Technology'   },
  history:     { color: '#ffb347', icon: '📜', label: 'History'      },
  philosophy:  { color: '#c084fc', icon: '🧠', label: 'Philosophy'   },
  arts:        { color: '#f472b6', icon: '🎨', label: 'Arts'         },
  nature:      { color: '#4ade80', icon: '🌿', label: 'Nature'       },
  society:     { color: '#fb923c', icon: '🏛️', label: 'Society'      },
  mathematics: { color: '#22d3ee', icon: '∑',  label: 'Mathematics'  },
  other:       { color: '#a78bfa', icon: '🔵', label: 'Topic'        },
};

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 9, color: '#2a3460', textTransform: 'uppercase',
        letterSpacing: '0.14em', fontFamily: "'IBM Plex Mono', monospace",
        marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }} />
        {title}
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }} />
      </div>
      {children}
    </div>
  );
}

export default function TopicPanel({ nodeData, onExpandNode, onClose }) {
  const [full, setFull]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [visible, setVisible]   = useState(false);
  const prevId = useRef(null);

  useEffect(() => {
    if (!nodeData) { setVisible(false); setFull(null); return; }
    if (nodeData.id !== prevId.current) {
      setVisible(false); setFull(null);
      prevId.current = nodeData.id;
      setTimeout(() => setVisible(true), 30);
    }
    setLoading(true);
    getTopicById(nodeData.id)
      .then(d => setFull(d.topic))
      .catch(() => setFull(null))
      .finally(() => setLoading(false));
  }, [nodeData?.id]);

  if (!nodeData) return null;
  const cat = CAT_META[nodeData.category] || CAT_META.other;
  const col = nodeData.color || cat.color;

  const handleExpand = async () => {
    setExpanding(true);
    try { await onExpandNode(nodeData.id); } finally { setExpanding(false); }
  };

  const topic = full || nodeData;

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(160deg, rgba(12,14,28,0.99) 0%, rgba(8,10,20,0.99) 100%)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderLeft: `2px solid ${col}55`,
      borderRadius: 14, overflow: 'hidden',
      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(18px)',
      transition: 'opacity 0.28s ease, transform 0.28s ease',
      boxShadow: `0 0 50px ${col}0e, inset 0 0 80px rgba(0,0,20,0.5)`,
    }}>

      {/* ── thumbnail ── */}
      {topic.thumbnail && (
        <div style={{ height: 120, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
          <img src={topic.thumbnail} alt={topic.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) saturate(0.8)' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 40%, rgba(12,14,28,0.95))` }} />
        </div>
      )}

      {/* ── header ── */}
      <div style={{
        padding: topic.thumbnail ? '10px 16px 14px' : '18px 16px 14px',
        background: topic.thumbnail ? 'transparent' : `linear-gradient(135deg, ${col}10 0%, transparent 60%)`,
        borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0,
        marginTop: topic.thumbnail ? -40 : 0, position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* category pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '2px 9px 2px 6px', borderRadius: 20, marginBottom: 8,
              background: `${col}20`, border: `1px solid ${col}40`,
            }}>
              <span style={{ fontSize: 9 }}>{cat.icon}</span>
              <span style={{ fontSize: 9, color: col, letterSpacing: '0.1em', fontFamily: "'IBM Plex Mono', monospace" }}>{cat.label}</span>
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#dde8ff', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
              {nodeData.name}
            </h2>
          </div>
          <button onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#2a3460', cursor: 'pointer', padding: 4, lineHeight: 1, borderRadius: 6, flexShrink: 0, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#6070a0'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#2a3460'; e.currentTarget.style.background = 'transparent'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* depth bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <span style={{ fontSize: 9, color: '#2a3460', fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>depth</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} style={{
                width: 16, height: 3, borderRadius: 2,
                background: i <= (nodeData.depth || 0) ? col : 'rgba(255,255,255,0.07)',
                boxShadow: i <= (nodeData.depth || 0) ? `0 0 5px ${col}60` : 'none',
              }} />
            ))}
          </div>
          <span style={{ fontSize: 9, color: col, fontFamily: "'IBM Plex Mono', monospace" }}>L{nodeData.depth || 0}</span>
        </div>
      </div>

      {/* ── scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 80, gap: 5 }}>
            {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: col, animation: `ld 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
          </div>
        ) : (
          <>
            <Section title="From Wikipedia">
              <p style={{ fontSize: 12, color: '#7080a0', lineHeight: 1.78, margin: 0 }}>
                {topic.fullDescription || topic.description || 'No description available.'}
              </p>
              {topic.wikiUrl && (
                <a href={topic.wikiUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10, fontSize: 10, color: col, textDecoration: 'none', fontFamily: "'IBM Plex Mono', monospace", opacity: 0.7, transition: 'opacity 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                  Read full article on Wikipedia
                </a>
              )}
            </Section>

            {topic.tags?.length > 0 && (
              <Section title="Keywords">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {topic.tags.map((t, i) => (
                    <span key={i} style={{
                      fontSize: 10, padding: '3px 9px', borderRadius: 20,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                      color: '#5060808', fontFamily: "'IBM Plex Mono', monospace", color: '#50688a',
                    }}>#{t}</span>
                  ))}
                </div>
              </Section>
            )}

            {topic.related_topics?.length > 0 && (
              <Section title="See Also">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {topic.related_topics.slice(0, 10).map((t, i) => (
                    <div key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 10, padding: '4px 10px', borderRadius: 20,
                      background: `${col}10`, border: `1px solid ${col}28`,
                      color: col, fontFamily: "'IBM Plex Mono', monospace",
                    }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: col, display: 'inline-block', flexShrink: 0 }} />
                      {t.length > 22 ? t.slice(0, 20) + '…' : t}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Node Info">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {[
                  { label: 'Category', val: cat.label },
                  { label: 'Depth',    val: `Level ${nodeData.depth || 0}` },
                  { label: 'Source',   val: 'Wikipedia' },
                  { label: 'Links',    val: `${topic.related_topics?.length || '?'} articles` },
                ].map(({ label, val }) => (
                  <div key={label} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 9, color: '#2a3460', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'IBM Plex Mono', monospace", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 11, color: '#7080a0', fontFamily: "'IBM Plex Mono', monospace" }}>{val}</div>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}
      </div>

      {/* ── footer ── */}
      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
        <button onClick={handleExpand} disabled={expanding}
          style={{
            width: '100%', padding: '11px', borderRadius: 9,
            background: expanding ? 'rgba(255,255,255,0.03)' : `linear-gradient(135deg, ${col}20 0%, ${col}12 100%)`,
            border: `1px solid ${expanding ? 'rgba(255,255,255,0.06)' : col + '38'}`,
            color: expanding ? '#2a3460' : '#b8cce0',
            fontSize: 11, fontWeight: 600, cursor: expanding ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s', fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: '0.06em', textTransform: 'uppercase',
            boxShadow: expanding ? 'none' : `0 0 22px ${col}15`,
          }}
          onMouseEnter={e => { if (!expanding) { e.currentTarget.style.background = `linear-gradient(135deg, ${col}30 0%, ${col}20 100%)`; e.currentTarget.style.boxShadow = `0 0 30px ${col}25`; } }}
          onMouseLeave={e => { if (!expanding) { e.currentTarget.style.background = `linear-gradient(135deg, ${col}20 0%, ${col}12 100%)`; e.currentTarget.style.boxShadow = `0 0 22px ${col}15`; } }}
        >
          {expanding
            ? <><span style={{ display: 'flex', gap: 3 }}>{[0,1,2].map(i=><span key={i} style={{ width:4,height:4,borderRadius:'50%',background:col,animation:`ld 1.2s ${i*0.2}s ease-in-out infinite` }}/>)}</span>Expanding…</>
            : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>Dive Deeper</>
          }
        </button>
      </div>
      <style>{`@keyframes ld{0%,80%,100%{transform:scale(0);opacity:0}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
