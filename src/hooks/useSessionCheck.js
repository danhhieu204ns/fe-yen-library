import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAuthToken } from '../services/authService';

// Hook này kiểm tra token có bị mất không (khi reload trang hoặc mở tab mới)
export const useSessionCheck = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem đã được xác thực nhưng token không còn
    if (isAuthenticated && !getAuthToken()) {
      // Token bị mất (có thể do đóng tab và mở lại)
      logout();
      navigate('/', { 
        replace: true,
        state: { message: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.' } 
      });
    }
  }, [isAuthenticated, logout, navigate]);
};
