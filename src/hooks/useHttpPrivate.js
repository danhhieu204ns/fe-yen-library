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
    useEffect(() => {
        // Hàm kiểm tra thời hạn token
        const checkTokenExpiration = () => {
            if (expirationTime && new Date().getTime() > new Date(expirationTime)) {
                dispatch(logOut())
                navigate("/")
                toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            }
        };

        checkTokenExpiration();

        const requestIntercept = httpRequestPrivate.interceptors.request.use(
            (config) => {
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
                    // handle logout
                    dispatch(logOut());
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            httpRequestPrivate.interceptors.request.eject(requestIntercept);
            httpRequestPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [accessToken]);

    return httpRequestPrivate;
};

export default useHttpPrivate;
