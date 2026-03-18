import { useState, useRef } from 'react';
const SUGGESTIONS=['Artificial Intelligence','Quantum Computing','Black Holes','Evolution','Consciousness','Jazz Music','Chaos Theory','Neuroscience','Silk Road','Ocean Ecosystems','String Theory','Dark Matter'];
export default function SearchBar({ onSearch, isLoading }) {
  const [q,setQ]=useState('');const [open,setOpen]=useState(false);const ref=useRef(null);
  const submit=(v)=>{const val=(v||q).trim();if(!val)return;setQ(val);onSearch(val);setOpen(false);};
  const filtered=q?SUGGESTIONS.filter(t=>t.toLowerCase().includes(q.toLowerCase())):SUGGESTIONS;
  const col='#00f5ff';
  return(
    <div style={{position:'relative',width:'100%',maxWidth:560}}>
      <div style={{
        display:'flex',alignItems:'center',
        background:'rgba(8,10,22,0.98)',
        border:`1px solid ${open||q?col+'40':'rgba(255,255,255,0.08)'}`,
        borderRadius:12,overflow:'hidden',
        boxShadow:open||q?`0 0 30px ${col}15`:'none',
        transition:'all 0.2s',
      }}>
        <div style={{padding:'0 14px',color:q?col:'#2a3460',flexShrink:0,transition:'color 0.2s'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </div>
        <input ref={ref} value={q}
          onChange={e=>{setQ(e.target.value);setOpen(true);}}
          onFocus={()=>setOpen(true)}
          onBlur={()=>setTimeout(()=>setOpen(false),150)}
          onKeyDown={e=>{if(e.key==='Enter')submit();if(e.key==='Escape'){setOpen(false);ref.current.blur();}}}
          placeholder="Search any topic to dive in..."
          disabled={isLoading}
          style={{flex:1,border:'none',outline:'none',background:'transparent',color:'#c8d8f0',fontSize:13,padding:'13px 0',fontFamily:"'Syne',sans-serif",fontWeight:500,caretColor:col}}
        />
        <button onClick={()=>submit()} disabled={isLoading||!q.trim()}
          style={{
            margin:5,padding:'7px 18px',borderRadius:8,border:'none',
            background:q.trim()?`linear-gradient(135deg,${col}30,${col}15)`:'transparent',
            color:q.trim()?col:'#2a3460',
            fontSize:11,fontWeight:700,cursor:q.trim()?'pointer':'default',
            fontFamily:"'Space Mono',monospace",letterSpacing:'0.08em',textTransform:'uppercase',
            boxShadow:q.trim()?`0 0 16px ${col}20`:'none',
            transition:'all 0.15s',flexShrink:0,
            border:q.trim()?`1px solid ${col}40`:'1px solid transparent',
          }}
          onMouseEnter={e=>{if(q.trim()){e.currentTarget.style.background=`linear-gradient(135deg,${col}45,${col}25)`;e.currentTarget.style.boxShadow=`0 0 24px ${col}35`;}}}
          onMouseLeave={e=>{e.currentTarget.style.background=q.trim()?`linear-gradient(135deg,${col}30,${col}15)`:'transparent';e.currentTarget.style.boxShadow=q.trim()?`0 0 16px ${col}20`:'none';}}>
          {isLoading?<span style={{display:'flex',gap:3,alignItems:'center'}}>{[0,1,2].map(i=><span key={i} style={{width:4,height:4,borderRadius:'50%',background:col,animation:`ld 1.2s ${i*.2}s ease-in-out infinite`}}/>)}</span>:'Explore →'}
        </button>
      </div>
      {open&&filtered.length>0&&(
        <div style={{position:'absolute',top:'calc(100% + 6px)',left:0,right:0,background:'rgba(6,7,16,0.99)',border:`1px solid ${col}20`,borderRadius:12,overflow:'hidden',zIndex:500,boxShadow:`0 16px 50px rgba(0,0,0,0.7),0 0 30px ${col}08`}}>
          <div style={{padding:'8px 14px 5px',fontSize:9,color:'#2a3460',textTransform:'uppercase',letterSpacing:'0.14em',fontFamily:"'Space Mono',monospace"}}>Suggested rabbit holes</div>
          {filtered.slice(0,8).map(t=>(
            <button key={t} onClick={()=>submit(t)}
              style={{display:'flex',alignItems:'center',gap:10,width:'100%',textAlign:'left',padding:'10px 14px',border:'none',background:'transparent',color:'#4a5880',fontSize:12,fontFamily:"'Syne',sans-serif",fontWeight:500,cursor:'pointer',transition:'all 0.12s'}}
              onMouseEnter={e=>{e.currentTarget.style.background=`${col}08`;e.currentTarget.style.color=col;}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#4a5880';}}>
              <span style={{fontSize:10,color:col,opacity:.5}}>→</span>{t}
            </button>
          ))}
        </div>
      )}
      <style>{`@keyframes ld{0%,80%,100%{transform:scale(0);opacity:0}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
