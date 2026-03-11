import { useState, useEffect, useRef } from 'react';
import { getTopicById, getYouTubeSearchUrl } from '../utils/api';
import { X, ExternalLink, Youtube, BookOpen, Tag, Layers, ChevronRight } from 'lucide-react';

const CAT_META = {
  science:     { color: '#4dffc3', label: 'Science',     icon: '🔬' },
  technology:  { color: '#38bdf8', label: 'Technology',  icon: '💻' },
  history:     { color: '#fbbf24', label: 'History',     icon: '📜' },
  philosophy:  { color: '#c084fc', label: 'Philosophy',  icon: '🧠' },
  arts:        { color: '#f472b6', label: 'Arts',        icon: '🎨' },
  nature:      { color: '#86efac', label: 'Nature',      icon: '🌿' },
  society:     { color: '#fb923c', label: 'Society',     icon: '🏛️' },
  mathematics: { color: '#22d3ee', label: 'Mathematics', icon: '∑'  },
  other:       { color: '#818cf8', label: 'Topic',       icon: '🔵' },
};

export default function InfoPanel({ nodeData, onExpandNode, onClose }) {
  const [full, setFull]           = useState(null);
  const [loading, setLoading]     = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [visible, setVisible]     = useState(false);
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
  const topic = full || nodeData;
  const youtubeUrl = getYouTubeSearchUrl(nodeData.name);

  const handleExpand = async () => {
    setExpanding(true);
    try { if (onExpandNode) await onExpandNode(nodeData.id); }
    finally { setExpanding(false); }
  };

  return (
    <div
      className="absolute top-4 right-4 w-72 flex flex-col overflow-hidden z-20"
      style={{
        maxHeight: 'calc(100% - 32px)',
        borderRadius: 20,
        background: 'rgba(5, 15, 30, 0.78)',
        backdropFilter: 'blur(50px) saturate(180%)',
        WebkitBackdropFilter: 'blur(50px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px rgba(0,0,0,0.7), 0 0 40px ${col}18`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(24px) scale(0.96)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      {/* Category header strip */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${col}, transparent)` }} />

      {/* Thumbnail */}
      {topic.thumbnail && (
        <div style={{ height: 120, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
          <img src={topic.thumbnail} alt={topic.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5) saturate(0.7)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 30%, rgba(5,15,30,0.96))` }} />
          <div className="absolute bottom-3 left-4 text-[9px] font-mono uppercase tracking-widest" style={{ color: 'rgba(200,220,255,0.5)' }}>
            From Wikipedia
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-4 pt-4 pb-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mb-2 text-[9px] font-mono" style={{
              background: `${col}15`, border: `1px solid ${col}35`, color: col,
            }}>
              <span>{cat.icon}</span> {cat.label}
            </div>
            <h2 className="text-[15px] font-semibold leading-snug text-white">{nodeData.name}</h2>
          </div>
          <button onClick={onClose}
            className="mt-0.5 flex-shrink-0 p-1.5 rounded-full transition-all"
            style={{ color: 'rgba(200,220,255,0.4)', background: 'rgba(255,255,255,0.05)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,220,255,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          >
            <X style={{ width: 13, height: 13 }} />
          </button>
        </div>

        {/* Depth indicator */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[9px] font-mono" style={{ color: 'rgba(200,220,255,0.3)' }}>depth</span>
          <div className="flex gap-1">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} style={{
                width: 14, height: 2, borderRadius: 1,
                background: i <= (nodeData.depth || 0) ? col : 'rgba(255,255,255,0.07)',
                boxShadow: i <= (nodeData.depth || 0) ? `0 0 6px ${col}70` : 'none',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
          <span className="text-[9px] font-mono" style={{ color: col }}>L{nodeData.depth || 0}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {loading ? (
          <div className="flex justify-center items-center h-16 gap-2">
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: col,
                animation: `pulse 1.2s ${i*0.2}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        ) : (
          <>
            {/* Wikipedia */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                <span className="text-[9px] font-mono uppercase tracking-widest flex items-center gap-1" style={{ color: 'rgba(200,220,255,0.3)' }}>
                  <BookOpen style={{ width: 9, height: 9 }} /> Phenomenon Overview
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(200,220,255,0.7)' }}>
                {topic.fullDescription || topic.description || 'No description available.'}
              </p>
              {topic.wikiUrl && (
                <a href={topic.wikiUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-mono transition-all group"
                  style={{ color: col, opacity: 0.7 }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                >
                  <ExternalLink style={{ width: 10, height: 10 }} />
                  Read full article on Wikipedia
                </a>
              )}
            </div>

            {/* YouTube */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                <span className="text-[9px] font-mono uppercase tracking-widest flex items-center gap-1" style={{ color: 'rgba(200,220,255,0.3)' }}>
                  <Youtube style={{ width: 9, height: 9, color: '#f87171' }} /> Watch on YouTube
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
              </div>

              {topic.videos?.length > 0 ? (
                <div className="space-y-2">
                  {topic.videos.map(v => (
                    <a key={v.videoId} href={v.youtubeUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-2 rounded-xl transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.06)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                    >
                      <img src={v.thumbnail} alt={v.title} className="w-14 h-9 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium leading-tight truncate text-white">{v.title}</div>
                        <div className="text-[9px] mt-0.5 truncate font-mono" style={{ color: 'rgba(200,220,255,0.4)' }}>{v.author}</div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.06)'}
                >
                  <Youtube style={{ width: 18, height: 18, color: '#f87171', flexShrink: 0 }} />
                  <div>
                    <div className="text-[11px] text-white font-medium">Search YouTube</div>
                    <div className="text-[9px] font-mono" style={{ color: 'rgba(200,220,255,0.4)' }}>"{nodeData.name} explained"</div>
                  </div>
                  <ExternalLink style={{ width: 10, height: 10, color: 'rgba(200,220,255,0.3)', marginLeft: 'auto', flexShrink: 0 }} />
                </a>
              )}
            </div>

            {/* Tags */}
            {topic.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {topic.tags.map((t, i) => (
                  <span key={i} className="text-[9px] px-2 py-0.5 rounded-full font-mono" style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(200,220,255,0.5)',
                  }}>
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Related */}
            {topic.related_topics?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                  <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'rgba(200,220,255,0.3)' }}>See Also</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {topic.related_topics.slice(0, 8).map((t, i) => (
                    <span key={i} className="text-[9px] px-2.5 py-1 rounded-full font-mono" style={{
                      background: `${col}12`, border: `1px solid ${col}28`, color: col,
                    }}>
                      {t.length > 22 ? t.slice(0, 20) + '…' : t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer buttons */}
      <div className="p-4 shrink-0 flex gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          className="flex-1 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          style={{
            background: `linear-gradient(135deg, ${col}18, ${col}0c)`,
            border: `1px solid ${col}35`,
            color: '#d0fdf0',
            boxShadow: `0 0 20px ${col}10`,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${col}28, ${col}16)`; e.currentTarget.style.boxShadow = `0 0 30px ${col}20`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${col}18, ${col}0c)`; e.currentTarget.style.boxShadow = `0 0 20px ${col}10`; }}
          onClick={handleExpand}
          disabled={expanding}
        >
          {expanding ? (
            <span className="flex gap-1">{[0,1,2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: col, animation: `pulse 1.2s ${i*0.2}s ease-in-out infinite` }} />)}</span>
          ) : <>View Details <ChevronRight style={{ width: 12, height: 12 }} /></>}
        </button>
        <button className="p-2.5 rounded-xl transition-all" style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(200,220,255,0.5)',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(200,220,255,0.5)'; }}
        >
          <ExternalLink style={{ width: 14, height: 14 }} />
        </button>
      </div>

      <style>{`@keyframes pulse{0%,80%,100%{transform:scale(0);opacity:0}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
