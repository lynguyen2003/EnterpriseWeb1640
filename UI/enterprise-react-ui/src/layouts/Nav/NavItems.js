import { Link } from 'react-scroll';

export const navbarItems = [
    {
        title: 'Home',
        url: '/#',
        cName: 'nav-link',
        icon: 'fa-solid fa-house',
    },
    {
        title: 'Dashboard',
        url: '/admin',
        cName: 'nav-link',
        icon: 'fa-solid fa-address-book',
    },
    {
        title: 'Manage Dashboard',
        url: '/manager',
        cName: 'nav-link',
        icon: 'fa-solid fa-address-book',
    },
    {
        title: 'Coordinator Dashboard',
        url: '/coordinator',
        cName: 'nav-link',
        icon: 'fa-solid fa-address-book',
    },
    {
        title: 'Contributions',
        url: '/contribution',
        cName: 'nav-link',
        icon: 'fa-solid fa-book-open',
    },
    {
        title: 'Published Contribution',
        url: '/contribution-list',
        cName: 'nav-link',
        icon: 'fa-solid fa-book-open',
    },
    {
        title: (
            <Link to="footer" smooth={true} duration={150}>
                About
            </Link>
        ),
        url: '/',
        cName: 'nav-link',
        icon: 'fa-solid fa-circle-info',
    },
    {
        title: 'Login',
        url: '/login',
        cName: 'nav-login',
        icon: 'fa-solid fa-right-to-bracket',
    },
];
