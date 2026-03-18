import { useState, useEffect } from 'react';
import { getTopicById } from '../../utils/api';

const CAT_NEON = {
  science:'#00f5ff',technology:'#bf5fff',history:'#ffb700',
  philosophy:'#ff2d78',arts:'#ff6b2b',nature:'#39ff8f',
  society:'#ffb700',mathematics:'#00f5ff',other:'#bf5fff',
};
const CAT_ICONS = {
  science:'🔬',technology:'💻',history:'📜',philosophy:'🧠',
  arts:'🎨',nature:'🌿',society:'🏛️',mathematics:'∑',other:'🔵',
};

function SuggestionCard({ node, onClick, delay = 0 }) {
  const col = node.color || CAT_NEON[node.category] || '#00f5ff';
  return (
    <button onClick={() => onClick && onClick(node)}
      style={{
        display: 'block', width: '100%', textAlign: 'left',
        background: 'rgba(10,11,20,0.8)', border: `1px solid rgba(255,255,255,0.06)`,
        borderLeft: `2px solid ${col}50`, borderRadius: 10, overflow: 'hidden',
        cursor: 'pointer', transition: 'all 0.2s', marginBottom: 8,
        animation: `fadeUp 0.3s ${delay}s both`,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${col}60`; e.currentTarget.style.background = `rgba(10,11,20,0.95)`; e.currentTarget.style.boxShadow = `0 0 24px ${col}14, 0 4px 20px rgba(0,0,0,0.4)`; e.currentTarget.style.transform = 'translateX(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderLeftColor = `${col}50`; e.currentTarget.style.background = 'rgba(10,11,20,0.8)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* thumbnail */}
      {node.thumbnail ? (
        <div style={{ height: 72, overflow: 'hidden', position: 'relative' }}>
          <img src={node.thumbnail} alt={node.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5) saturate(0.6)' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 30%, rgba(10,11,20,0.9))` }} />
          <div style={{ position: 'absolute', top: 6, left: 8, fontSize: 9, color: col, fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.1em', background: `${col}18`, padding: '2px 6px', borderRadius: 4 }}>
            {CAT_ICONS[node.category] || '🔵'} {node.category}
          </div>
        </div>
      ) : (
        <div style={{ height: 40, background: `linear-gradient(135deg, ${col}10, transparent)`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{CAT_ICONS[node.category] || '🔵'}</span>
          <span style={{ fontSize: 9, color: col, fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>{node.category}</span>
        </div>
      )}

      {/* text */}
      <div style={{ padding: '8px 12px 10px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#c0d0e8', fontFamily: "'Syne',sans-serif", lineHeight: 1.3, marginBottom: 4 }}>
          {node.name.length > 28 ? node.name.slice(0, 26) + '…' : node.name}
        </div>
        <div style={{ fontSize: 10, color: '#3a4870', fontFamily: "'Outfit',sans-serif", lineHeight: 1.5,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {node.description || 'Click to explore this topic'}
        </div>
      </div>
    </button>
  );
}

export default function RightPanel({ activeNode, connectedNodes, onNodeClick }) {
  const [details, setDetails] = useState(null);
  const col = activeNode?.color || '#00f5ff';

  useEffect(() => {
    if (!activeNode) { setDetails(null); return; }
    getTopicById(activeNode.id).then(d => setDetails(d.topic)).catch(() => {});
  }, [activeNode?.id]);

  return (
    <div style={{
      width: 270, flexShrink: 0, height: '100%',
      background: 'rgba(6,7,14,0.97)',
      borderLeft: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
        <div style={{ fontSize: 9, color: '#2a3460', textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: "'Space Mono',monospace", marginBottom: 4 }}>
          Connected
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#e0e8ff', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.01em' }}>
          {activeNode ? (
            <span>
              <span style={{ color: col, textShadow: `0 0 16px ${col}` }}>{connectedNodes?.length || 0}</span>
              {' '}Suggestions
            </span>
          ) : 'Suggestions'}
        </div>
      </div>

      {/* cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
        {!activeNode && (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: '#2a3460', fontSize: 11, fontFamily: "'Space Mono',monospace", lineHeight: 1.8 }}>
            Search a topic<br />to see connected<br />suggestions
          </div>
        )}
        {connectedNodes?.length === 0 && activeNode && (
          <div style={{ textAlign: 'center', padding: '30px 16px', color: '#2a3460', fontSize: 11, fontFamily: "'Space Mono',monospace", lineHeight: 1.8 }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>🌌</div>
            Click a node to<br />expand connections
          </div>
        )}
        {connectedNodes?.map((node, i) => (
          <SuggestionCard key={node.id} node={node} onClick={onNodeClick} delay={i * 0.05} />
        ))}
      </div>

      {/* active node quick info */}
      {activeNode && (
        <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.04)', flexShrink: 0, background: 'rgba(8,9,18,0.9)' }}>
          <div style={{ fontSize: 9, color: '#2a3460', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'Space Mono',monospace", marginBottom: 6 }}>Active Node</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, boxShadow: `0 0 10px ${col}`, flexShrink: 0, animation: 'pulse 2s ease-in-out infinite' }} />
            <div style={{ fontSize: 12, fontWeight: 700, color: '#a8b8d0', fontFamily: "'Syne',sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeNode.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
