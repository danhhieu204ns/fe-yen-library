import httpRequest from 'src/utils/httpRequest';
import useHttpPrivate from 'src/hooks/useHttpPrivate';

// Service xử lý authentication

// Lưu token vào sessionStorage (sẽ bị xóa khi đóng tab/trình duyệt)
export const setAuthToken = (token) => {
  sessionStorage.setItem('auth_token', token);
};

// Lấy token từ sessionStorage
export const getAuthToken = () => {
  return sessionStorage.getItem('auth_token');
};

// Xóa token
export const removeAuthToken = () => {
  sessionStorage.removeItem('auth_token');
};

// Lưu user info
export const setUserInfo = (user) => {
  sessionStorage.setItem('user_info', JSON.stringify(user));
};

// Lấy user info
export const getUserInfo = () => {
  const userInfo = sessionStorage.getItem('user_info');
  return userInfo ? JSON.parse(userInfo) : null;
};

// Xóa user info
export const removeUserInfo = () => {
  sessionStorage.removeItem('user_info');
};

// Kiểm tra trạng thái đăng nhập
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Logout - xóa toàn bộ thông tin session
export const logout = () => {
  removeAuthToken();
  removeUserInfo();
};

export const login = async ({ username, password }) => {
    try {
        const formData = new URLSearchParams();  // Tạo đối tượng URLSearchParams để gửi dưới dạng form data
        formData.append('username', username);
        formData.append('password', password);
        const res = await httpRequest.post('/login', formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }, });
        return res.data;
    } catch (error) {
        console.log(error.response?.data);  // Hiển thị chi tiết lỗi từ máy chủ nếu có
        return error.response;
    }
};


const useAuthPrivateApi = () => {
    const httpPrivate = useHttpPrivate();

    const changePassword = async ({ currentPassword, newPassword }) => {
        try {
            const res = await httpPrivate.put('/user/me/change/password', {
                oldPassword: currentPassword,
                newPassword,
            });

            return res.data;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    };

    return { changePassword };
};

export default useAuthPrivateApi;
