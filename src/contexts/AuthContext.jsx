import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getAuthToken, 
  getUserInfo, 
  isAuthenticated as checkAuth, 
  logout as logoutService,
  setAuthToken,
  setUserInfo, 
  login
} from '../services/authService';

// Tạo context cho authentication
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra trạng thái auth khi app khởi động
  useEffect(() => {
    const initAuth = () => {
      // Kiểm tra xem có token trong sessionStorage không
      if (checkAuth()) {
        const userInfo = getUserInfo();
        setUser(userInfo);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Xử lý đăng nhập
  const login = async (credentials) => {
    try {
      // Thực hiện gọi API đăng nhập - thay đổi theo API của bạn
      const response = await login(credentials);
      
      console.log(response);
      if (response.status !== 200) {
        throw new Error(response?.data?.detail || 'Đăng nhập thất bại');
      }
      
      // Lưu token vào sessionStorage
      setAuthToken(data.token);
      setUserInfo(data.user);
      
      // Cập nhật state
      setUser(data.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Xử lý đăng xuất
  const logout = () => {
    logoutService();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};
