export default function RabbitHolePath({ path, onNavigate }) {
  if (!path||path.length===0) return null;
  return (
    <div style={{display:'flex',alignItems:'center',gap:5,padding:'8px 14px',background:'rgba(10,12,22,0.95)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:10,overflowX:'auto',scrollbarWidth:'none',backdropFilter:'blur(12px)'}}>
      <span style={{fontSize:9,color:'#2a3450',textTransform:'uppercase',letterSpacing:'0.14em',fontFamily:"'IBM Plex Mono',monospace",flexShrink:0}}>path</span>
      <span style={{color:'#1a2030',fontSize:11,flexShrink:0,marginRight:2}}>·</span>
      {path.map((item,i)=>(
        <div key={`${item.id}-${i}`} style={{display:'flex',alignItems:'center',gap:4,flexShrink:0,animation:`si 0.25s ${i*0.04}s both`}}>
          {i>0&&<span style={{color:'#1a2030',fontSize:12,lineHeight:1}}>›</span>}
          <button onClick={()=>onNavigate&&onNavigate(item)}
            style={{padding:'3px 11px',borderRadius:22,border:'none',
              background:i===path.length-1?`${item.color||'#78d2ff'}18`:'transparent',
              color:i===path.length-1?(item.color||'#78d2ff'):'#3a4460',
              fontSize:10,cursor:'pointer',transition:'all 0.14s',
              fontFamily:"'IBM Plex Mono',monospace",fontWeight:i===path.length-1?600:400,
              outline:i===path.length-1?`1px solid ${item.color||'#78d2ff'}30`:'1px solid transparent',
              boxShadow:i===path.length-1?`0 0 12px ${item.color||'#78d2ff'}15`:'none',}}
            onMouseEnter={e=>{e.currentTarget.style.color=item.color||'#78d2ff';e.currentTarget.style.background=`${item.color||'#78d2ff'}12`;}}
            onMouseLeave={e=>{e.currentTarget.style.color=i===path.length-1?(item.color||'#78d2ff'):'#3a4460';e.currentTarget.style.background=i===path.length-1?`${item.color||'#78d2ff'}18`:'transparent';}}
          >{item.name}</button>
        </div>
      ))}
      {path.length>1&&<button onClick={()=>onNavigate&&onNavigate(null)}
        style={{marginLeft:4,background:'none',border:'none',color:'#1a2030',cursor:'pointer',padding:3,flexShrink:0,borderRadius:4,transition:'all 0.12s'}}
        onMouseEnter={e=>e.currentTarget.style.color='#4a5470'} onMouseLeave={e=>e.currentTarget.style.color='#1a2030'} title="Reset path">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>}
      <style>{`@keyframes si{from{opacity:0;transform:translateX(6px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
