import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { navbarItems } from './NavItems';
import { selectIsAuthenticated, logOut } from '~/feature/auth/authSlice';
import './Nav.css';

function Nav() {
    const [clicked, setClicked] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isLoggedIn = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();

    // Function to handle logout
    const handleLogout = () => {
        // Dispatch the logOut action to clear user authentication information
        dispatch(logOut());
    };
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
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
                    <Link to="/login">
                        <button
                            type="button"
                            className="btn-login btn btn-outline-primary"
                        >
                            Login
                        </button>
                    </Link>
                ) : (
                    <div>
                        <div className="profile-icons" onClick={toggleDropdown}>
                            <i className="fa-solid fa-user"></i>
                            {isDropdownOpen && (
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to="/">Profile</Link>
                                    </li>
                                    <li>
                                        <Link to="/">Settings</Link>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            className="btn-login btn btn-outline-primary"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            )}
                            {/* <li>
                                Profile
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="btn-login btn btn-outline-primary"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li> */}
                        </div>
                    </div>
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
