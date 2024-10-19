import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from 'src/redux/auth/authSlice';

const RequireAuth = () => {
    const token = useSelector(selectCurrentToken);

    if (!token) return <Navigate to="/login" />;

    return <Outlet />;
};

export default RequireAuth;
