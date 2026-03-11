import { useEffect, useRef } from 'react';

// Bokeh light particle config
const PARTICLES = [
  { x: 10, y: 15, size: 180, color: 'rgba(77, 255, 195, 0.12)', delay: 0, duration: 11 },
  { x: 75, y: 10, size: 250, color: 'rgba(56, 189, 248, 0.10)', delay: 2, duration: 14 },
  { x: 90, y: 60, size: 200, color: 'rgba(192, 132, 252, 0.13)', delay: 1, duration: 9 },
  { x: 20, y: 70, size: 150, color: 'rgba(77, 255, 195, 0.08)', delay: 4, duration: 12 },
  { x: 50, y: 85, size: 120, color: 'rgba(129, 140, 248, 0.10)', delay: 3, duration: 10 },
  { x: 35, y: 30, size: 90,  color: 'rgba(77, 255, 195, 0.15)', delay: 6, duration: 8 },
  { x: 65, y: 50, size: 70,  color: 'rgba(192, 132, 252, 0.12)', delay: 2, duration: 13 },
  { x: 80, y: 80, size: 110, color: 'rgba(56, 189, 248, 0.09)', delay: 5, duration: 11 },
];

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep night sky base */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 20% 20%, #0a1628 0%, #03080f 50%, #050b18 100%)'
      }} />

      {/* Aurora curtain layers */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 0%, rgba(20, 180, 120, 0.18) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 70% 0%, rgba(77, 255, 195, 0.12) 0%, transparent 55%),
          radial-gradient(ellipse 70% 35% at 45% 5%, rgba(56, 189, 248, 0.10) 0%, transparent 60%)
        `,
        animation: 'aurora-move 15s ease-in-out infinite alternate',
      }} />
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 50% 30% at 80% 5%, rgba(192, 132, 252, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse 40% 25% at 10% 10%, rgba(129, 140, 248, 0.10) 0%, transparent 55%)
        `,
        animation: 'aurora-move 18s ease-in-out 2s infinite alternate-reverse',
      }} />

      {/* Bokeh floating particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
            filter: 'blur(8px)',
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Stars layer */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.6) 0%, transparent 100%),
          radial-gradient(1px 1px at 35% 10%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 55% 35%, rgba(255,255,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 72% 18%, rgba(255,255,255,0.7) 0%, transparent 100%),
          radial-gradient(1px 1px at 88% 42%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 25% 55%, rgba(255,255,255,0.3) 0%, transparent 100%),
          radial-gradient(1px 1px at 48% 65%, rgba(255,255,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 60% 75%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 82% 62%, rgba(255,255,255,0.6) 0%, transparent 100%),
          radial-gradient(2px 2px at 5%  8%,  rgba(255,255,255,0.8) 0%, transparent 100%),
          radial-gradient(2px 2px at 93% 15%, rgba(255,255,255,0.7) 0%, transparent 100%),
          radial-gradient(1px 1px at 40% 88%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 70% 90%, rgba(255,255,255,0.3) 0%, transparent 100%)
        `,
      }} />

      {/* Ground mountain silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{
        background: 'linear-gradient(to top, rgba(3,8,15,0.95) 0%, rgba(3,8,15,0.6) 60%, transparent 100%)',
      }} />

      <style>{`
        @keyframes aurora-move {
          0% { transform: translateX(-3%) scaleY(1); opacity: 0.8; }
          50% { transform: translateX(3%) scaleY(1.1); opacity: 1; }
          100% { transform: translateX(-1%) scaleY(0.95); opacity: 0.9; }
        }
        @keyframes float-particle {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          33% { transform: translate(-45%, -60%) scale(1.1); opacity: 0.9; }
          66% { transform: translate(-55%, -45%) scale(0.9); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
