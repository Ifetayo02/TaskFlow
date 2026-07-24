import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBoard, setCurrentBoard] = useState(null);
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentBoard(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser.token) {
      localStorage.setItem('token', updatedUser.token);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout, updateUser,
      currentBoard, setCurrentBoard,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);