import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { navbarItems } from './NavItems';
import {
    selectIsAuthenticated,
    selectCurrentToken,
    selectCurrentEmail,
    logOut,
} from '~/feature/auth/authSlice';
import axios from 'axios';
import './Nav.css';

function Nav() {
    const [clicked, setClicked] = useState(false);
    const [userRoles, setUserRoles] = useState([]);

    const email = useSelector(selectCurrentEmail);
    const token = useSelector(selectCurrentToken);
    const isLoggedIn = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserRoles = async () => {
            try {
                const response = await axios.get(
                    `https://localhost:7136/api/SetupRole/GetUserRoles?email=${email}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                setUserRoles(response.data);
            } catch (error) {
                console.error('Error fetching user roles:', error);
            }
        };

        fetchUserRoles();
    }, [token, email]);

    const hasRequiredRole = () => {
        // Check if user has one of the required roles: ADMIN, MARKETINGCOORDINATOR, MARKETINGMANAGER
        return (
            userRoles.includes('Admin') ||
            userRoles.includes('MarketingCoordinator') ||
            userRoles.includes('MarketingManager')
        );
    };

    // Function to handle logout
    const handleLogout = () => {
        // Dispatch the logOut action to clear user authentication information
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
                    // Conditionally render Contributions item based on user roles
                    if (item.title === ' Contributions' && !hasRequiredRole()) {
                        return null; // Hide Contributions item if user doesn't have required roles
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
                {isLoggedIn ? ( // Conditional rendering for login/logout button
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
