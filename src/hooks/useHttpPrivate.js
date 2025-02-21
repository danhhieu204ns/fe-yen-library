import httpRequestPrivate from '../utils/httpRequest'
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentExpirationTime } from 'src/redux/auth/authSlice';
import { useEffect } from 'react';
import { logOut } from 'src/redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useHttpPrivate = () => {
    const accessToken = useSelector(selectCurrentToken);
    const expirationTime = useSelector(selectCurrentExpirationTime);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkTokenAndLogout = () => {
        if (expirationTime && new Date().getTime() > expirationTime) {
            dispatch(logOut());
            navigate("/login");
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            return true;
        }
        return false;
    };

    useEffect(() => {
        const requestIntercept = httpRequestPrivate.interceptors.request.use(
            (config) => {
                if (checkTokenAndLogout()) {
                    return Promise.reject("Token expired");
                }
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = httpRequestPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const statusCode = error?.response?.status;
                if (statusCode === 501 || statusCode === 403) {
                    dispatch(logOut());
                    navigate('/login');
                    toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            httpRequestPrivate.interceptors.request.eject(requestIntercept);
            httpRequestPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [accessToken, expirationTime]);

    return httpRequestPrivate;
};

export default useHttpPrivate;
