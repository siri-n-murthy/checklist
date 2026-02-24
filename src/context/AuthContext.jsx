import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Checking for saved user...');
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        console.log('AuthProvider: Found saved user:', parsed);
        setUser(parsed);
      }
    } catch (err) {
      console.error('AuthProvider: Error loading user:', err);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('AuthProvider: Logging in user:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('AuthProvider: Logging out');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('dashboardData');
    localStorage.removeItem('checklistTasks');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('weeklyGoals');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth: Must be used within AuthProvider');
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
