import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smarthire_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('smarthire_token');
    if (token) {
      api.getCurrentUser()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('smarthire_user', JSON.stringify(userData));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('smarthire_token', res.token);
    const userData = {
      id: res.id,
      email: res.email,
      fullName: res.fullName,
      role: res.role,
      profileId: res.profileId
    };
    setUser(userData);
    localStorage.setItem('smarthire_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (data) => {
    const res = await api.register(data);
    localStorage.setItem('smarthire_token', res.token);
    const userData = {
      id: res.id,
      email: res.email,
      fullName: res.fullName,
      role: res.role,
      profileId: res.profileId
    };
    setUser(userData);
    localStorage.setItem('smarthire_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('smarthire_token');
    localStorage.removeItem('smarthire_user');
    setUser(null);
  };

  const demoLogin = async (roleType) => {
    let email = 'student@smarthire.ai';
    if (roleType === 'STUDENT_2') email = 'student2@smarthire.ai';
    if (roleType === 'STUDENT_3') email = 'student3@smarthire.ai';
    if (roleType === 'RECRUITER') email = 'recruiter@google.com';
    if (roleType === 'PLACEMENT') email = 'placement@university.edu';
    if (roleType === 'ADMIN') email = 'admin@smarthire.ai';

    return await login(email, 'password123');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
