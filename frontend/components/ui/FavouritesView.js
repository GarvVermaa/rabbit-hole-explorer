import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiGetFavourites, apiDeleteFavourite } from '../../utils/api';

export default function FavouritesView({ onLoadFavourite }) {
  const { token, isLoggedIn } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    apiGetFavourites(token)
      .then(setFavourites)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, isLoggedIn]);

  const handleDelete = async (id) => {
    try {
      await apiDeleteFavourite(token, id);
      setFavourites(f => f.filter(x => x._id !== id));
    } catch {}
  };

  const col = '#00f5ff';

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 40 }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: '#e8f0ff' }}>Sign In Required</h2>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: '#4a5880', fontWeight: 600, textAlign: 'center', maxWidth: 320 }}>
          Sign in to save and view your favourite rabbit holes.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: 11, color: col, fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>Loading favourites…</div>
      </div>
    );
  }

  if (!favourites.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 40 }}>
        <div style={{ fontSize: 48 }}>⭐</div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: '#e8f0ff' }}>No Favourites Yet</h2>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: '#4a5880', fontWeight: 600, textAlign: 'center', maxWidth: 320 }}>
          Explore a topic and click the Save button to bookmark your rabbit holes.
        </p>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 24 }}>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: '#e8f0ff', marginBottom: 20, letterSpacing: '-0.02em' }}>
        ⭐ Your Favourites
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {favourites.map(fav => (
          <div key={fav._id} style={{
            padding: 16, borderRadius: 14,
            background: 'rgba(10,11,18,0.8)',
            border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer', transition: 'all 0.18s',
          }}
            onClick={() => onLoadFavourite && onLoadFavourite(fav)}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = `${col}40`;
              e.currentTarget.style.boxShadow = `0 4px 24px ${col}10`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: '#d0d8f0', margin: 0 }}>
                {fav.customName || fav.title}
              </h3>
              <button onClick={e => { e.stopPropagation(); handleDelete(fav._id); }}
                style={{
                  background: 'none', border: 'none', color: '#4a5880', cursor: 'pointer',
                  fontSize: 14, padding: 2, lineHeight: 1, flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#ff4444'}
                onMouseLeave={e => e.currentTarget.style.color = '#4a5880'}
              >✕</button>
            </div>
            {fav.path?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                {fav.path.slice(0, 5).map((node, i) => (
                  <span key={i} style={{
                    padding: '3px 8px', borderRadius: 12, fontSize: 9, fontWeight: 700,
                    fontFamily: "'Space Mono',monospace",
                    background: `${node.color || col}15`,
                    border: `1px solid ${node.color || col}30`,
                    color: node.color || col,
                  }}>
                    {node.icon || '🔵'} {node.name?.length > 16 ? node.name.slice(0, 14) + '…' : node.name}
                  </span>
                ))}
                {fav.path.length > 5 && (
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#3a4870', fontFamily: "'Space Mono',monospace", padding: '3px 4px' }}>
                    +{fav.path.length - 5} more
                  </span>
                )}
              </div>
            )}
            <div style={{ fontSize: 9, fontWeight: 700, color: '#2a3460', fontFamily: "'Space Mono',monospace" }}>
              {new Date(fav.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
