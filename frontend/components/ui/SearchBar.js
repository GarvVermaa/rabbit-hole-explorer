import { useState, useRef } from 'react';
const SUGGESTIONS=['Artificial Intelligence','Quantum Computing','Black Holes','Evolution','Consciousness','Jazz Music','Chaos Theory','Neuroscience','Silk Road','Ocean Ecosystems'];
export default function SearchBar({ onSearch, isLoading }) {
  const [q,setQ]=useState('');const [open,setOpen]=useState(false);const ref=useRef(null);
  const submit=(v)=>{const val=(v||q).trim();if(!val)return;setQ(val);onSearch(val);setOpen(false);};
  const filtered=q?SUGGESTIONS.filter(t=>t.toLowerCase().includes(q.toLowerCase())):SUGGESTIONS;
  return(
    <div style={{position:'relative',width:'100%',maxWidth:520}}>
      <div style={{display:'flex',alignItems:'center',background:'rgba(14,18,32,0.95)',border:'1px solid rgba(120,210,255,0.15)',borderRadius:10,overflow:'hidden',boxShadow:'0 0 0 0 rgba(120,210,255,0)',transition:'box-shadow 0.2s'}}
        onFocus={()=>{}} onMouseEnter={e=>e.currentTarget.style.boxShadow='0 0 0 3px rgba(120,210,255,0.08)'} onMouseLeave={e=>e.currentTarget.style.boxShadow='0 0 0 0 rgba(120,210,255,0)'}>
        <div style={{padding:'0 12px',color:'#2a3450',flexShrink:0}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </div>
        <input ref={ref} value={q} onChange={e=>{setQ(e.target.value);setOpen(true);}} onFocus={()=>setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),150)}
          onKeyDown={e=>{if(e.key==='Enter')submit();if(e.key==='Escape'){setOpen(false);ref.current.blur();}}}
          placeholder="Search any topic to explore..." disabled={isLoading}
          style={{flex:1,border:'none',outline:'none',background:'transparent',color:'#a8c8e8',fontSize:13,padding:'11px 0',fontFamily:"'IBM Plex Mono',monospace",caretColor:'#78d2ff'}}/>
        <button onClick={()=>submit()} disabled={isLoading||!q.trim()}
          style={{margin:'4px',padding:'6px 16px',borderRadius:7,border:'none',
            background:q.trim()?'rgba(120,210,255,0.15)':'transparent',
            color:q.trim()?'#78d2ff':'#2a3450',fontSize:11,fontWeight:600,
            letterSpacing:'0.08em',textTransform:'uppercase',
            fontFamily:"'IBM Plex Mono',monospace",cursor:q.trim()?'pointer':'default',
            transition:'all 0.15s',flexShrink:0,
            boxShadow:q.trim()?'0 0 14px rgba(120,210,255,0.1)':'none',}}
          onMouseEnter={e=>{if(q.trim())e.currentTarget.style.background='rgba(120,210,255,0.25)';}}
          onMouseLeave={e=>{e.currentTarget.style.background=q.trim()?'rgba(120,210,255,0.15)':'transparent';}}>
          {isLoading?<span style={{display:'flex',gap:3,alignItems:'center'}}>{[0,1,2].map(i=><span key={i} style={{width:4,height:4,borderRadius:'50%',background:'#78d2ff',animation:`ld 1.2s ${i*0.2}s ease-in-out infinite`}}/>)}</span>:'Go →'}
        </button>
      </div>
      {open&&filtered.length>0&&(
        <div style={{position:'absolute',top:'calc(100% + 5px)',left:0,right:0,background:'rgba(10,12,24,0.99)',border:'1px solid rgba(120,210,255,0.12)',borderRadius:10,overflow:'hidden',zIndex:500,boxShadow:'0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(120,210,255,0.05)'}}>
          <div style={{padding:'6px 12px 4px',fontSize:9,color:'#2a3450',textTransform:'uppercase',letterSpacing:'0.14em',fontFamily:"'IBM Plex Mono',monospace"}}>Suggested rabbit holes</div>
          {filtered.map(t=>(
            <button key={t} onClick={()=>submit(t)}
              style={{display:'block',width:'100%',textAlign:'left',padding:'9px 14px',border:'none',background:'transparent',color:'#5a6a8a',fontSize:12,fontFamily:"'IBM Plex Mono',monospace",cursor:'pointer',transition:'all 0.12s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(120,210,255,0.06)';e.currentTarget.style.color='#78d2ff';}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#5a6a8a';}}>
              <span style={{color:'#2a3450',marginRight:8,fontSize:10}}>→</span>{t}
            </button>
          ))}
        </div>
      )}
      <style>{`@keyframes ld{0%,80%,100%{transform:scale(0);opacity:0}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
