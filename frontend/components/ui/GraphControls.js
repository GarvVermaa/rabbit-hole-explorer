export default function GraphControls({ nodeCount, edgeCount }) {
  return (
    <div className="glass-panel px-4 py-2.5 flex items-center gap-5">
      {/* Stats */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: '#4A9EFF', boxShadow: '0 0 6px #4A9EFF' }}
        />
        <span className="text-xs font-mono text-slate-400">
          {nodeCount} <span className="text-slate-600">nodes</span>
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className="w-3 h-px"
          style={{ background: '#4A9EFF', opacity: 0.4 }}
        />
        <span className="text-xs font-mono text-slate-400">
          {edgeCount} <span className="text-slate-600">edges</span>
        </span>
      </div>

      <div className="w-px h-4 bg-slate-700" />

      {/* Controls hint */}
      <div className="hidden md:flex items-center gap-3 text-slate-600 text-xs font-mono">
        <span>🖱 drag to rotate</span>
        <span>⚙ scroll to zoom</span>
        <span>👆 click to explore</span>
      </div>
    </div>
  );
}
