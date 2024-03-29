import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Contribution from '~/pages/Contribution';
import Admin from '~/pages/Admin';

const privateRoutes = [
    { path: '/contribution', component: Contribution },
    { path: '/admin', component: Admin, layout: null },
];

const publicRoutes = [
    // { path: '/contribution', component: Contribution },
    { path: '/', component: Home },
    { path: '/login', component: Login, layout: null },
];

export { publicRoutes, privateRoutes };
