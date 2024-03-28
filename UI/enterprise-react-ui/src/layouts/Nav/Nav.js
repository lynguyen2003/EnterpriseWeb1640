import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { navbarItems } from './NavItems';
import { selectIsAuthenticated, logOut } from '~/feature/auth/authSlice';
import { useGetAllContributionQuery } from '~/feature/contribution/contributionApiSlice';
import './Nav.css';

function Nav() {
    const [clicked, setClicked] = useState(false);
    const dispatch = useDispatch();

    const isLoggedIn = useSelector(selectIsAuthenticated);
    const data = useGetAllContributionQuery();

    const handleLogout = () => {
        alert('You have been logged out')
        dispatch(logOut());
    };

    return (
        <nav className="NavbarItems">
            <img
                className="navbar-logo"
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/12/Logo-Truong-Dai-hoc-Greenwich-Viet-Nam.png"
                height="60"
                alt=""
                loading="lazy"
            />

            <ul className={clicked ? 'nav-menu active' : 'nav-menu'}>
                {navbarItems.map((item, index) => {
                    if (
                        item.title === ' Contributions' &&
                        (!isLoggedIn || data.isError)
                    ) {
                        return null;
                    }
                    return (
                        <li key={index}>
                            <Link to={item.url} className={item.cName}>
                                <i className={item.icon}></i>
                                {item.title}
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <ul className="navbar-nav ms-auto">
                {isLoggedIn ? (
                    <button
                        type="button"
                        className="btn-login btn btn-outline-primary"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : (
                    <Link to="/login">
                        <button
                            type="button"
                            className="btn-login btn btn-outline-primary"
                        >
                            Login
                        </button>
                    </Link>
                )}
            </ul>
            <div className="menu-icons">
                <i
                    className={clicked ? 'fas fa-times' : 'fas fa-bars'}
                    onClick={() => setClicked(!clicked)}
                ></i>
            </div>
        </nav>
    );
}

export default Nav;
