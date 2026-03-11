import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ForceGraph2D so it doesn't run during SSR
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 flex items-center justify-center text-primary text-glow animate-pulse">Loading Graph...</div>
});

export default function NetworkGraph({ data, onNodeClick }) {
  const fgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef(null);

  useEffect(() => {
    // Update dimensions on mount and window resize
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-crosshair overflow-hidden">
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={data}
        nodeLabel="id"
        nodeColor={(node) => node.group === 1 ? '#78d2ff' : '#b48cff'}
        nodeRelSize={8}
        linkColor={() => 'rgba(120, 210, 255, 0.2)'}
        linkWidth={1}
        linkOpacity={0.6}
        onNodeClick={(node) => {
          if (fgRef.current) {
            fgRef.current.centerAt(node.x, node.y, 1000);
            fgRef.current.zoom(8, 1000); // 8 is a good zoom level for 2d
          }
          if (onNodeClick) onNodeClick(node);
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px "IBM Plex Sans"`;
          
          // Draw a glowing node
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val || 5, 0, 2 * Math.PI, false);
          
          ctx.shadowBlur = 15;
          ctx.shadowColor = node.group === 1 ? '#78d2ff' : '#b48cff';
          ctx.fillStyle = node.group === 1 ? 'rgba(120, 210, 255, 0.8)' : 'rgba(180, 140, 255, 0.8)';
          ctx.fill();
          ctx.shadowBlur = 0; // Reset shadow for text

          // Draw label
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 

          ctx.fillStyle = 'rgba(17, 21, 38, 0.8)';
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y + (node.val || 5) + 2, bckgDimensions[0], bckgDimensions[1]);
          
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#e2e8f0';
          ctx.fillText(label, node.x, node.y + (node.val || 5) + 2 + bckgDimensions[1]/2);
        }}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.4}
      />
      {/* Overlay gradient mask to soften edges depending on design preference */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_40px_#080a12]"></div>
    </div>
  );
}
