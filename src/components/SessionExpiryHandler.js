import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Component này sẽ đảm bảo đăng xuất người dùng nếu tab không hoạt động
const SessionExpiryHandler = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Đăng xuất khi tab ẩn (không hoạt động) trong thời gian dài
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Lưu thời điểm ẩn tab
        sessionStorage.setItem('tabHiddenTime', Date.now().toString());
      } else if (document.visibilityState === 'visible') {
        const tabHiddenTime = parseInt(sessionStorage.getItem('tabHiddenTime') || '0');
        const currentTime = Date.now();
        const timeElapsed = currentTime - tabHiddenTime;
        
        // Nếu tab đã ẩn quá lâu (ví dụ: 30 phút = 1800000ms), đăng xuất
        if (timeElapsed > 1800000) {
          logout();
          navigate('/login', { 
            state: { message: 'Phiên làm việc đã hết hạn do không hoạt động' }
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [logout, navigate]);

  return null; // Component này không render UI
};

export default SessionExpiryHandler;
