import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Contribution from '~/pages/Contribution';
import { DefaultLayout } from '~/layouts';

import Dashboard from '~/pages/Admin/dashboard';
import ManagerContributions from '~/pages/Manager/dashboard/Contributions';
import Users from '~/pages/Admin/users';
import Form from '~/pages/Admin/form';
import Bar from '~/pages/Manager/chart/Bar';
import Line from '~/pages/Manager/chart/Line';
import Pie from '~/pages/Manager/chart/Pie';
import FAQ from '~/scenes/faq';
import Calendar from '~/scenes/calendar/calendar';
import Geography from '~/scenes/geography';
import AdminLayout from '~/layouts/AdminLayout/AdminLayout';
import Deadlines from '~/pages/Admin/deadline';
import Coordinator from '~/pages/Coordinator';
import ForgotPwd from '~/pages/Password/ForgotPwd';
import ResetPwd from '~/pages/Password/ResetPwd';
import Statistics from '~/pages/Manager/statistics/Statistics';
import Guest from '~/pages/Guest';
import Profile from '~/pages/Profile';
import CoordinatorManageUsers from '~/pages/Coordinator/Users';
import ManagerDashboard from '~/pages/Manager/dashboard/Dashboard';

const privateRoutes = [
    { path: '/contribution', component: Contribution, layout: DefaultLayout, requiredRoles: 'Student' },
    { path: '/contribution-list', component: Guest, layout: DefaultLayout, requiredRoles: ['Guest', 'Student'] },

    { path: '/profile', component: Profile, layout: DefaultLayout },
    { path: '/forgot-password', component: ForgotPwd, layout: null, requiredRoles: null },
    { path: '/reset-password', component: ResetPwd, layout: null, requiredRoles: null },

    { path: '/coordinator', component: Coordinator, layout: AdminLayout, requiredRoles: 'MarketingCoordinator' },
    {
        path: '/coordinator/users',
        component: CoordinatorManageUsers,
        layout: AdminLayout,
        requiredRoles: 'MarketingCoordinator',
    },

    {
        path: '/manager',
        component: ManagerDashboard,
        layout: AdminLayout,
        requiredRoles: 'MarketingManager',
    },
    {
        path: '/manager/contribution',
        component: ManagerContributions,
        layout: AdminLayout,
        requiredRoles: 'MarketingManager',
    },
    { path: '/manager/statistics', component: Statistics, layout: AdminLayout, requiredRoles: 'MarketingManager' },
    { path: '/manager/pie', component: Pie, layout: AdminLayout, requiredRoles: 'MarketingManager' },
    { path: '/manager/bar', component: Bar, layout: AdminLayout, requiredRoles: 'MarketingManager' },
    { path: '/manager/line', component: Line, layout: AdminLayout, requiredRoles: 'MarketingManager' },

    { path: '/admin', component: Dashboard, layout: AdminLayout, requiredRoles: 'Admin' },
    { path: '/admin/users', component: Users, layout: AdminLayout, requiredRoles: 'Admin' },
    { path: '/admin/form', component: Form, layout: AdminLayout, requiredRoles: 'Admin' },
    { path: '/admin/deadlines', component: Deadlines, layout: AdminLayout, requiredRoles: 'Admin' },

    {
        path: '/faq',
        component: FAQ,
        layout: AdminLayout,
        requiredRoles: ['Admin', 'MarketingManager', 'MarketingCoordinator'],
    },
    {
        path: '/calendar',
        component: Calendar,
        layout: AdminLayout,
        requiredRoles: ['Admin', 'MarketingManager', 'MarketingCoordinator'],
    },
    { path: '/admin/geography', component: Geography, layout: AdminLayout, requiredRoles: 'Admin' },
];

const publicRoutes = [
    { path: '/', component: Home, layout: DefaultLayout },
    { path: '/login', component: Login, layout: null },
];

export { publicRoutes, privateRoutes };
