import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import PrivacyPolicy from 'views/pages/PrivacyPolicy';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));
const Emailforgotpassword = Loadable(lazy(() => import('views/pages/authentication/forgotPassword/EmailForgotPassword')));
const RememberPassword = Loadable(lazy(() => import('views/pages/authentication/forgotPassword/ForgotPassword')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/login',
            element: <AuthLogin3 />
        },
        {
            path: '/',
            element: <AuthLogin3 />
        },
        {
            path: '/pages/register/register3',
            element: <AuthRegister3 />
        },
        {
            path: '/emailforgotpassword',
            element: <Emailforgotpassword />
        },
        {
            path: '/remember_password',
            element: <RememberPassword />
        },
        {
            path: '/politica_privacidade',
            element: <PrivacyPolicy />
        }
    ]
};

export default AuthenticationRoutes;
