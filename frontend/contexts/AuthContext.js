import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiGetProfile } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check localStorage for existing token
  useEffect(() => {
    const stored = localStorage.getItem('rhe_token');
    const storedRefresh = localStorage.getItem('rhe_refresh');
    if (stored) {
      setToken(stored);
      apiGetProfile(stored)
        .then(u => setUser(u))
        .catch(() => {
          localStorage.removeItem('rhe_token');
          localStorage.removeItem('rhe_refresh');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData, accessToken, refreshToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('rhe_token', accessToken);
    localStorage.setItem('rhe_refresh', refreshToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rhe_token');
    localStorage.removeItem('rhe_refresh');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
