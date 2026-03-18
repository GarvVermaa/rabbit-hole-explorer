export default function LeftSidebar({ collapsed, onToggle, path, onNavigate, graphStats }) {
  const col = '#00f5ff';
  return (
    <div style={{
      width: collapsed ? 48 : 220,
      flexShrink: 0, height: '100%',
      background: 'rgba(8,9,16,0.96)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden', position: 'relative',
      zIndex: 20,
    }}>
      {/* toggle */}
      <button onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-end',
          padding: '14px 12px', background: 'none', border: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          cursor: 'pointer', color: '#2a3460', transition: 'all 0.15s', flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = col}
        onMouseLeave={e => e.currentTarget.style.color = '#2a3460'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {collapsed
            ? <path d="M9 18l6-6-6-6"/>
            : <path d="M15 18l-6-6 6-6"/>}
        </svg>
      </button>

      {!collapsed && (
        <>
          {/* logo */}
          <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#e8f0ff', fontFamily: "'Syne',sans-serif", lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Rabbit<br />
              <span style={{ color: col, textShadow: `0 0 20px ${col}` }}>Hole</span>
            </div>
            <div style={{ fontSize: 9, color: '#2a3460', fontFamily: "'Space Mono',monospace", letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>
              Knowledge Explorer
            </div>
          </div>

          {/* stats */}
          {graphStats && (
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
              <div style={{ fontSize: 9, color: '#2a3460', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'Space Mono',monospace", marginBottom: 10 }}>Graph Stats</div>
              {[
                { label: 'Nodes', val: graphStats.nodes, col: '#00f5ff' },
                { label: 'Edges', val: graphStats.edges, col: '#bf5fff' },
                { label: 'Depth', val: graphStats.depth, col: '#39ff8f' },
              ].map(({ label, val, col: c }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: '#3a4870', fontFamily: "'Space Mono',monospace" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c, fontFamily: "'Syne',sans-serif", textShadow: `0 0 10px ${c}80` }}>{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* path history */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
            <div style={{ fontSize: 9, color: '#2a3460', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'Space Mono',monospace", padding: '0 16px', marginBottom: 8 }}>
              Exploration Path
            </div>
            {path.length === 0 && (
              <div style={{ padding: '8px 16px', fontSize: 10, color: '#2a3460', fontFamily: "'Space Mono',monospace" }}>
                No path yet
              </div>
            )}
            {path.map((item, i) => (
              <button key={`${item.id}-${i}`} onClick={() => onNavigate && onNavigate(item)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  width: '100%', padding: '8px 16px',
                  background: i === path.length - 1 ? `${item.color || col}10` : 'transparent',
                  border: 'none', borderLeft: i === path.length - 1 ? `2px solid ${item.color || col}` : '2px solid transparent',
                  cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                  animation: `slideIn 0.2s ${i * 0.04}s both`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${item.color || col}10`; }}
                onMouseLeave={e => { e.currentTarget.style.background = i === path.length - 1 ? `${item.color || col}10` : 'transparent'; }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.color || col, boxShadow: `0 0 8px ${item.color || col}`, flexShrink: 0 }} />
                  {i < path.length - 1 && <div style={{ width: 1, height: 18, background: `${item.color || col}30`, marginTop: 2 }} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: i === path.length - 1 ? 700 : 400, color: i === path.length - 1 ? '#c8d8f0' : '#3a4870', fontFamily: "'Syne',sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 9, color: '#2a3460', fontFamily: "'Space Mono',monospace" }}>depth {i}</div>
                </div>
              </button>
            ))}
          </div>

          {/* legend */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
            <div style={{ fontSize: 9, color: '#2a3460', fontFamily: "'Space Mono',monospace", lineHeight: 2 }}>
              drag · scroll zoom<br />click node → explore
            </div>
          </div>
        </>
      )}

      {/* collapsed icons */}
      {collapsed && path.length > 0 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', gap: 6, overflowY: 'auto' }}>
          {path.slice(-5).map((item, i) => (
            <button key={item.id} onClick={() => onNavigate && onNavigate(item)}
              style={{ width: 8, height: 8, borderRadius: '50%', background: item.color || col, border: 'none', cursor: 'pointer', boxShadow: `0 0 8px ${item.color || col}`, flexShrink: 0 }}
              title={item.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
