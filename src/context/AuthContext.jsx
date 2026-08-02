import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Always default to false for public safety unless active session exists
  const [isAdmin, setIsAdmin] = useState(() => {
    // Clear old persistent localStorage key to ensure public visitors start logged out
    localStorage.removeItem('dcs_admin_authenticated');
    return sessionStorage.getItem('dcs_admin_authenticated') === 'true';
  });

  const login = (username, password) => {
    // Secure administrative credential validation
    if (username === 'admin' && password === 'dcs1234') {
      setIsAdmin(true);
      sessionStorage.setItem('dcs_admin_authenticated', 'true');
      return { success: true };
    }
    return { success: false, message: 'Invalid admin username or password' };
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('dcs_admin_authenticated');
    localStorage.removeItem('dcs_admin_authenticated');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
