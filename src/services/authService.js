import httpRequest from 'src/utils/httpRequest';
import useHttpPrivate from 'src/hooks/useHttpPrivate';


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

export const loginFace = async (formData) => {
    try {
        const res = await httpRequest.post('/login_face', formData, {
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
