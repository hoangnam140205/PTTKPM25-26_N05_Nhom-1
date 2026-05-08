import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // Mock authentication
    if (username === 'admin' && password === '123') {
      setUser({ username, role: 'admin' });
      return true;
    }
    if (username === 'staff' && password === '123') {
      setUser({ username, role: 'staff' });
      return true;
    }
    if (username === 'khachhang' && password === '123') {
      setUser({ username, role: 'customer' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
