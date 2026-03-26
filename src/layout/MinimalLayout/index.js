import { Outlet } from 'react-router-dom';

// project imports
import Policy from 'layout/Policy';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => (
    <>
        <Outlet />
        <Policy />
    </>
);

export default MinimalLayout;
