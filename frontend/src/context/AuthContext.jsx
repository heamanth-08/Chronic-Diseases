import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vitascreen_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('vitascreen_token');
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
          localStorage.setItem('vitascreen_user', JSON.stringify(userData));
        } catch (err) {
          localStorage.removeItem('vitascreen_token');
          localStorage.removeItem('vitascreen_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();

    const handleLogout = () => {
      setUser(null);
    };
    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, []);

  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const data = await api.login({ email: cleanEmail, password });
    localStorage.setItem('vitascreen_token', data.access_token);
    const userObj = {
      id: data.user_id,
      email: data.email,
      full_name: data.full_name,
      has_profile: data.has_profile
    };
    setUser(userObj);
    localStorage.setItem('vitascreen_user', JSON.stringify(userObj));
    return data;
  };

  const register = async (email, password, full_name) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (full_name || '').trim();
    const data = await api.register({ email: cleanEmail, password, full_name: cleanName });
    localStorage.setItem('vitascreen_token', data.access_token);
    const userObj = {
      id: data.user_id,
      email: data.email,
      full_name: data.full_name,
      has_profile: false
    };
    setUser(userObj);
    localStorage.setItem('vitascreen_user', JSON.stringify(userObj));
    return data;
  };

  const logout = () => {
    localStorage.removeItem('vitascreen_token');
    localStorage.removeItem('vitascreen_user');
    setUser(null);
  };

  const updateProfileStatus = (hasProfile) => {
    setUser(prev => {
      const updated = { ...prev, has_profile: hasProfile };
      localStorage.setItem('vitascreen_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfileStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
