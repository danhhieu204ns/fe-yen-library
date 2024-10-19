import { Outlet } from 'react-router-dom';

function GuestLayout() {
    return (
        <div className="min-h-screen relative flex">
            <Outlet />
        </div>
    );
}

export default GuestLayout;
