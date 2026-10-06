import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = storage.getUser();
    const token = storage.getToken();
    if (savedUser && token) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const userData = {
      id: data.userId,
      name: data.name,
      email: data.email || email,
      role: data.role
    };
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    storage.setUser(updated);
    setUser(updated);
  };

  const isSeeker = user?.role === 'ROLE_SEEKER';
  const isOwner = user?.role === 'ROLE_OWNER';
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        isAuthenticated,
        isSeeker,
        isOwner,
        isAdmin,
        loading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
