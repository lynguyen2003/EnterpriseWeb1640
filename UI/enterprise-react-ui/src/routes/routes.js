import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Contribution from '~/pages/Contribution';

const privateRoutes = [{ path: '/contribution', component: Contribution }];

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/login', component: Login, layout: null },
];

export { publicRoutes, privateRoutes };
