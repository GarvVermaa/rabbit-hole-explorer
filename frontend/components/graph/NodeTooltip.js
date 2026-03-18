export default function NodeTooltip({ nodeData, position }) {
  if (!nodeData) return null;
  const col = nodeData.color || '#00f5ff';
  const left = position.x + 16, top = position.y - 12;
  return (
    <div style={{ position:'fixed', left, top, pointerEvents:'none', zIndex:1000, maxWidth:200,
      background:'rgba(5,5,10,0.97)', border:`1px solid ${col}40`, borderRadius:10,
      padding:'10px 13px', backdropFilter:'blur(16px)',
      boxShadow:`0 8px 32px rgba(0,0,0,0.6), 0 0 24px ${col}15`,
      fontFamily:"'Outfit',sans-serif",
      transform: left > window.innerWidth - 220 ? 'translateX(-110%)' : undefined,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:5 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:col, boxShadow:`0 0 8px ${col}`, flexShrink:0 }}/>
        <span style={{ fontSize:9, color:col, textTransform:'uppercase', letterSpacing:'0.14em', fontFamily:"'Space Mono',monospace" }}>{nodeData.category||'topic'}</span>
      </div>
      <div style={{ fontSize:12, fontWeight:700, color:'#d0e0ff', marginBottom:4, lineHeight:1.3, fontFamily:"'Syne',sans-serif" }}>{nodeData.name}</div>
      <div style={{ fontSize:10, color:'#3a4870', lineHeight:1.55 }}>{nodeData.description ? nodeData.description.slice(0,80)+'…' : 'Click to explore'}</div>
      <div style={{ marginTop:7, fontSize:9, color:`${col}70`, fontFamily:"'Space Mono',monospace" }}>click → new centre</div>
    </div>
  );
}
