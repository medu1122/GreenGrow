import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Set base URL from environment (Vercel)
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      if (typeof window !== 'undefined') localStorage.setItem('token', newToken);
      
      toast.success('Đăng nhập thành công!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Đăng nhập thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      
      setToken(newToken);
      setUser(newUser);
      if (typeof window !== 'undefined') localStorage.setItem('token', newToken);
      
      toast.success('Đăng ký thành công!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Đăng ký thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Đăng xuất thành công!');
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      setUser(response.data.user);
      toast.success('Cập nhật thông tin thành công!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Cập nhật thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put('/api/auth/password', { currentPassword, newPassword });
      toast.success('Đổi mật khẩu thành công!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Đổi mật khẩu thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
