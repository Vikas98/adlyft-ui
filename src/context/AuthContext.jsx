import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adlyft_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('adlyft_token');
      const storedUser = localStorage.getItem('adlyft_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await loginApi(email, password);
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem('adlyft_token', newToken);
    localStorage.setItem('adlyft_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setLoading(false);
    return newUser;
  };

  const register = async ({ name, email, password, company }) => {
    const response = await registerApi({ name, email, password, company });
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem('adlyft_token', newToken);
    localStorage.setItem('adlyft_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setLoading(false);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('adlyft_token');
    localStorage.removeItem('adlyft_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
