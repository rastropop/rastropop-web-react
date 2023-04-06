import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// sample page routing
// const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const Profile = Loadable(lazy(() => import('views/Profile')));
const StopPoints = Loadable(lazy(() => import('views/StopPoints')));
const Horimetro = Loadable(lazy(() => import('views/Horimetro')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/',
            element: <Profile />
        },
        {
            path: '/dashboard',
            element: <Profile />
        },
        {
            path: '/pontosdeParada',
            element: <StopPoints />
        },
        {
            path: '/horimetro',
            element: <Horimetro />
        }
    ]
};

export default MainRoutes;
