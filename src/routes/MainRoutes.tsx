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
const Trajetos = Loadable(lazy(() => import('views/Trajetos')));
const ExceededSpeed = Loadable(lazy(() => import('views/ExceededSpeed')));
const InterestZones = Loadable(lazy(() => import('views/InterestZones')));
const Dashboard = Loadable(lazy(() => import('views/Dashboard')));
const PositionHistory = Loadable(lazy(() => import('views/PositionHistory')));
const Tracking = Loadable(lazy(() => import('views/Tracking')));

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
            path: '/profile',
            element: <Profile />
        },
        {
            path: '/pontosdeParada',
            element: <StopPoints />
        },
        {
            path: '/horimetro',
            element: <Horimetro />
        },
        {
            path: '/trajetos',
            element: <Trajetos />
        },
        {
            path: '/velocidadeExcedida',
            element: <ExceededSpeed />
        },
        {
            path: '/zonaDeInteresse',
            element: <InterestZones />
        },
        {
            path: '/dashboard',
            element: <Dashboard />
        },
        {
            path: '/historicoDePosicoes',
            element: <PositionHistory />
        },
        {
            path: '/localizar',
            element: <Tracking />
        }
    ]
};

export default MainRoutes;
