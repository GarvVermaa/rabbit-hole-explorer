export default function NodeTooltip({ nodeData, position }) {
  if (!nodeData) return null;
  const col=nodeData.color||'#78d2ff';
  const left=position.x+16,top=position.y-14;
  return(
    <div style={{position:'fixed',left,top,pointerEvents:'none',zIndex:1000,maxWidth:210,
      background:'rgba(8,10,20,0.97)',border:`1px solid ${col}35`,borderRadius:10,
      padding:'11px 14px',boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${col}12`,
      fontFamily:"'IBM Plex Sans',system-ui,sans-serif",
      transform:left>window.innerWidth-230?'translateX(-110%)':undefined,
      backdropFilter:'blur(12px)',}}>
      <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:6}}>
        <div style={{width:6,height:6,borderRadius:'50%',background:col,boxShadow:`0 0 8px ${col}`,flexShrink:0}}/>
        <span style={{fontSize:9,color:col,textTransform:'uppercase',letterSpacing:'0.12em',fontFamily:"'IBM Plex Mono',monospace"}}>{nodeData.category||'topic'}</span>
      </div>
      <div style={{fontSize:12,fontWeight:600,color:'#c8d8f0',marginBottom:5,lineHeight:1.35}}>{nodeData.name}</div>
      <div style={{fontSize:11,color:'#3a4868',lineHeight:1.55}}>{nodeData.description?nodeData.description.slice(0,95)+'…':'Click to make this the new centre'}</div>
      <div style={{marginTop:8,fontSize:9,color:col,opacity:0.5,fontFamily:"'IBM Plex Mono',monospace"}}>click → new centre · shift+click → expand</div>
    </div>
  );
}
