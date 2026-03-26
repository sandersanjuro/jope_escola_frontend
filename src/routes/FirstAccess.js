import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const NewPassword = Loadable(lazy(() => import('views/pages/authentication/auth-forms/NewPassword')));
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const FirstAccess = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/',
            element: <NewPassword />
        },
        {
            path: '/index',
            element: <NewPassword />
        }
    ]
};

export default FirstAccess;
