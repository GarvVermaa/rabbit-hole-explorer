import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiLogout } from '../../utils/api';

export default function ProfileDropdown({ onClose }) {
  const { user, token, logout } = useAuth();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleLogout = async () => {
    try { await apiLogout(token); } catch {}
    logout();
    onClose();
  };

  const col = '#00f5ff';
  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div ref={ref} style={{
      position: 'absolute', top: '100%', right: 0, marginTop: 8,
      width: 240, padding: 16, borderRadius: 14, zIndex: 100,
      background: 'rgba(10,11,18,0.95)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
      animation: 'fadeUp 0.2s ease',
    }}>
      {/* avatar circle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: `linear-gradient(135deg, ${col}, #bf5fff)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: '#050508',
          fontFamily: "'Syne',sans-serif",
        }}>
          {(user?.email || '?')[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#d0d8f0', fontFamily: "'Outfit',sans-serif" }}>
            {user?.email || 'User'}
          </div>
          {joined && (
            <div style={{ fontSize: 9, fontWeight: 700, color: '#3a4870', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Joined {joined}
            </div>
          )}
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 -4px 12px' }} />

      <button onClick={handleLogout} style={{
        width: '100%', padding: '9px 0', borderRadius: 8,
        background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)',
        color: '#ff6666', fontSize: 11, fontWeight: 800, cursor: 'pointer',
        fontFamily: "'Syne',sans-serif", letterSpacing: '0.04em',
        transition: 'all 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,68,68,0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,68,68,0.08)'; }}
      >
        Sign Out
      </button>
    </div>
  );
}
