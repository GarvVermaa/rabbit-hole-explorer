import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from './SearchBar';
import AuthModal from './AuthModal';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar({ view, onViewChange, onSearch, isLoading, onSave, canSave, error }) {
  const { user, isLoggedIn } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);

  const col = '#00f5ff';

  const handleSave = () => {
    if (!isLoggedIn) { setShowAuth(true); return; }
    if (!canSave) return;
    onSave && onSave();
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1200);
  };

  const navItems = [
    { key: 'explore', label: 'Explore', icon: '🌐' },
    { key: 'favourites', label: 'Favourites', icon: '⭐' },
  ];

  return (
    <>
      <header style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 16px', height: 56,
        background: 'rgba(5,5,8,0.97)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)', zIndex: 40,
      }}>
        {/* Logo */}
        <div onClick={() => onViewChange('explore')} style={{
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          flexShrink: 0, marginRight: 4,
        }}>
          <span style={{ fontSize: 22 }}>🐇</span>
          <span style={{
            fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15,
            color: '#e8f0ff', letterSpacing: '-0.03em',
            display: 'flex', alignItems: 'center', gap: 0,
          }}>
            Rabbit<span style={{ color: col }}>Hole</span>
          </span>
        </div>

        {/* Nav items */}
        <nav style={{ display: 'flex', gap: 2, marginRight: 8 }}>
          {navItems.map(item => {
            const active = view === item.key;
            return (
              <button key={item.key}
                onClick={() => {
                  if (item.key === 'favourites' && !isLoggedIn) { setShowAuth(true); return; }
                  onViewChange(item.key);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                  fontFamily: "'Syne',sans-serif",
                  background: active ? `${col}12` : 'transparent',
                  border: active ? `1px solid ${col}30` : '1px solid transparent',
                  color: active ? col : '#4a5880',
                  cursor: 'pointer', transition: 'all 0.15s',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#8090b0'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#4a5880'; e.currentTarget.style.background = 'transparent'; } }}
              >
                <span style={{ fontSize: 13 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Search bar — centered */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <SearchBar onSearch={(q) => { onViewChange('explore'); onSearch(q); }} isLoading={isLoading} />
        </div>

        {/* Save button */}
        <button onClick={handleSave}
          disabled={!canSave && isLoggedIn}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '7px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800,
            fontFamily: "'Syne',sans-serif",
            background: saveFlash ? `${col}20` : canSave ? 'rgba(255,255,255,0.03)' : 'transparent',
            border: saveFlash ? `1px solid ${col}50` : '1px solid rgba(255,255,255,0.06)',
            color: saveFlash ? col : canSave ? '#8090b0' : '#2a3460',
            cursor: canSave || !isLoggedIn ? 'pointer' : 'default',
            transition: 'all 0.2s', flexShrink: 0,
            letterSpacing: '0.02em',
          }}
          onMouseEnter={e => { if (canSave) { e.currentTarget.style.color = col; e.currentTarget.style.borderColor = `${col}40`; } }}
          onMouseLeave={e => { if (canSave && !saveFlash) { e.currentTarget.style.color = '#8090b0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; } }}
        >
          <span style={{ fontSize: 13 }}>★</span>
          {saveFlash ? 'Saved!' : 'Save'}
        </button>

        {/* Error */}
        {error && (
          <div style={{ fontSize: 9, fontWeight: 700, color: '#ff4444', fontFamily: "'Space Mono',monospace", background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', padding: '4px 8px', borderRadius: 6, flexShrink: 0 }}>
            ⚠ {error}
          </div>
        )}

        {/* User / Login */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {isLoggedIn ? (
            <button onClick={() => setShowProfile(p => !p)} style={{
              width: 34, height: 34, borderRadius: '50%',
              background: `linear-gradient(135deg, ${col}, #bf5fff)`,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: '#050508',
              fontFamily: "'Syne',sans-serif",
              boxShadow: `0 2px 12px ${col}30`,
              transition: 'transform 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {(user?.email || '?')[0].toUpperCase()}
            </button>
          ) : (
            <button onClick={() => setShowAuth(true)} style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 11, fontWeight: 800,
              fontFamily: "'Syne',sans-serif",
              background: `linear-gradient(135deg, ${col}, #bf5fff)`,
              border: 'none', color: '#050508', cursor: 'pointer',
              letterSpacing: '0.02em',
              boxShadow: `0 2px 12px ${col}25`,
              transition: 'transform 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Sign In
            </button>
          )}
          {showProfile && <ProfileDropdown onClose={() => setShowProfile(false)} />}
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
