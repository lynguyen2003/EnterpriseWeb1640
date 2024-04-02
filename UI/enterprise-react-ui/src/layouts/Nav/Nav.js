import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { navbarItems } from './NavItems';
import { selectIsAuthenticated, logOut } from '~/feature/auth/authSlice';
import { selectCurrentToken } from '~/feature/auth/authSlice';
import './Nav.css';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';

function Nav() {
    const [clicked, setClicked] = useState(false);
    const currentToken = useSelector(selectCurrentToken);
    const dispatch = useDispatch();

    const isLoggedIn = useSelector(selectIsAuthenticated);
    const userObject = currentToken ? jwtDecode(currentToken) : { role: null };

    const handleLogout = () => {
        toast.success('Logout successfully');
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
                        (item.title === ' Contributions' && (!isLoggedIn || userObject.role !== 'Student')) ||
                        (item.title === ' Dashboard' && (!isLoggedIn || userObject.role !== 'Admin')) ||
                        (item.title === ' Manage Dashboard' &&
                            (!isLoggedIn || userObject.role !== 'MarketingManager')) ||
                        (item.title === ' About' && isLoggedIn)
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
                    <button type="button" className="btn-login btn btn-outline-primary" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <Link to="/login">
                        <button type="button" className="btn-login btn btn-outline-primary">
                            Login
                        </button>
                    </Link>
                )}
                <ToastContainer />
            </ul>
            <div className="menu-icons">
                <i className={clicked ? 'fas fa-times' : 'fas fa-bars'} onClick={() => setClicked(!clicked)}></i>
            </div>
        </nav>
    );
}

export default Nav;
