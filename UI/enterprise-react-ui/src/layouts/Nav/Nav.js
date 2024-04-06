import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { navbarItems } from './NavItems';
import './Nav.css';
import { selectIsAuthenticated, logOut, selectCurrentEmail } from '~/feature/auth/authSlice';

import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';

import { Avatar, Box, Divider, IconButton, ListItemIcon } from '@mui/material';
import { selectCurrentToken } from '~/feature/auth/authSlice';
import { Logout, Settings } from '@mui/icons-material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LockResetIcon from '@mui/icons-material/LockReset';

function Nav() {
    const [clicked, setClicked] = useState(false);
    const currentToken = useSelector(selectCurrentToken);
    const email = useSelector(selectCurrentEmail);
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const isLoggedIn = useSelector(selectIsAuthenticated);
    const userObject = currentToken ? jwtDecode(currentToken) : { role: null };

    const handleLogout = () => {
        toast.success('Logout successfully');
        dispatch(logOut());
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                        (item.title === ' Coordinator Dashboard' &&
                            (!isLoggedIn || userObject.role !== 'MarketingCoordinator')) ||
                        (item.title === ' Manage Dashboard' &&
                            (!isLoggedIn || userObject.role !== 'MarketingManager')) ||
                        (item.title === ' Contribution List' && (!isLoggedIn || userObject.role !== 'Guest')) ||
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
                    <Box>
                        <Box>
                            <IconButton onClick={handleClick}>
                                <PersonOutlinedIcon fontSize="large" />
                            </IconButton>
                        </Box>

                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleClose}>
                                <Avatar /> {email}
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <ManageAccountsIcon fontSize="small" />
                                </ListItemIcon>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Link to="/forgot-password">
                                    <ListItemIcon>
                                        <LockResetIcon fontSize="small" />
                                    </ListItemIcon>
                                    Reset Password
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <Settings fontSize="small" />
                                </ListItemIcon>
                                Settings
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
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
