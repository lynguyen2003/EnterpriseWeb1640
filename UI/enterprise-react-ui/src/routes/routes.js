import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Contribution from '~/pages/Contribution';
import Manage from '~/pages/Manage/Manage';

const privateRoutes = [
    { path: '/contribution', component: Contribution },
    { path: '/manage', component: Manage },
];

const publicRoutes = [
    // { path: '/contribution', component: Contribution },
    { path: '/', component: Home },
    { path: '/login', component: Login, layout: null },
];

export { publicRoutes, privateRoutes };
