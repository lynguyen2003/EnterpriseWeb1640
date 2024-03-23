import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { navbarItems } from './NavItems';
import {
    selectIsAuthenticated,
    selectCurrentToken,
    logOut,
} from '~/feature/auth/authSlice';
import axios from 'axios';
import './Nav.css';

function Nav() {
    const [clicked, setClicked] = useState(false);
    const [isAuthorized, setAuthorized] = useState(false); // Changed default state to false

    const token = useSelector(selectCurrentToken);
    const isLoggedIn = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                await axios.get('https://localhost:7136/api/Contributions', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAuthorized(false);
            } catch (error) {
                console.error('Error fetching articles:', error);
                setAuthorized(true); // Set isAuthorized to false if there's an error
            }
        };

        fetchArticles();
    }, [token]);

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
                    if (item.title === ' Contributions' && isAuthorized) {
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
