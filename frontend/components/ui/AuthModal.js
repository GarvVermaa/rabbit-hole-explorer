import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiLogin, apiRegister } from '../../utils/api';

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const fn = mode === 'login' ? apiLogin : apiRegister;
      const data = await fn(email, password);
      login(data.user, data.accessToken, data.refreshToken);
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const col = '#00f5ff';

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeUp 0.25s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 380, padding: 32, borderRadius: 16,
        background: 'rgba(10,11,18,0.92)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(24px)',
        boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 60px ${col}10`,
      }}>
        <h2 style={{
          fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22,
          color: '#e8f0ff', marginBottom: 6, letterSpacing: '-0.02em',
        }}>
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{
          fontFamily: "'Outfit',sans-serif", fontSize: 12, color: '#4a5880',
          marginBottom: 24,
        }}>
          {mode === 'login' ? 'Sign in to save your rabbit holes' : 'Start exploring and saving your discoveries'}
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 14 }}>
            <span style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#5a6890', marginBottom: 5, fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 13,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#d0d8f0', fontFamily: "'Outfit',sans-serif", fontWeight: 600, outline: 'none',
              }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 20 }}>
            <span style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#5a6890', marginBottom: 5, fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 13,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#d0d8f0', fontFamily: "'Outfit',sans-serif", fontWeight: 600, outline: 'none',
              }}
            />
          </label>

          {error && (
            <div style={{ fontSize: 11, fontWeight: 700, color: '#ff4444', marginBottom: 14, fontFamily: "'Space Mono',monospace", background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', padding: '6px 10px', borderRadius: 8 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '11px 0', borderRadius: 10, fontSize: 13, fontWeight: 800,
            fontFamily: "'Syne',sans-serif", cursor: loading ? 'wait' : 'pointer',
            background: `linear-gradient(135deg, ${col}, #bf5fff)`,
            border: 'none', color: '#050508', letterSpacing: '0.02em',
            boxShadow: `0 4px 20px ${col}30`,
            opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s',
          }}>
            {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: 18, fontSize: 12, color: '#4a5880',
          fontFamily: "'Outfit',sans-serif", fontWeight: 600,
        }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            style={{ color: col, cursor: 'pointer', fontWeight: 700 }}>
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
}
