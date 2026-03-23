import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('adlyft_token');
    const storedUser = localStorage.getItem('adlyft_user');
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('adlyft_token');
        localStorage.removeItem('adlyft_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await loginApi(email, password);
    const { token, user: newUser } = response.data;
    localStorage.setItem('adlyft_token', token);
    localStorage.setItem('adlyft_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const register = async (data) => {
    const response = await registerApi(data);
    const { token, user: newUser } = response.data;
    localStorage.setItem('adlyft_token', token);
    localStorage.setItem('adlyft_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('adlyft_token');
    localStorage.removeItem('adlyft_user');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
