import { useState } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import { tokens } from '../../theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { useGetUserByEmailQuery } from '~/feature/user/userApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentEmail, selectCurrentToken } from '~/feature/auth/authSlice';
import { jwtDecode } from 'jwt-decode';

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    );
};

const Sidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const email = useSelector(selectCurrentEmail);
    const currentToken = useSelector(selectCurrentToken);
    const { role } = currentToken ? jwtDecode(currentToken) : { role: null };
    const { data: users } = useGetUserByEmailQuery(email);
    const fullName = users ? users[0].fullName : 'Unknown User';
    const [isCollapsed, setIsCollapsed] = useState(false);
    const isAdmin = role === 'Admin';
    const isManager = role === 'MarketingManager';
    const isCoordinator = role === 'MarketingCoordinator';
    const [selected, setSelected] = useState('Dashboard');

    return (
        <Box
            sx={{
                '& .pro-sidebar-inner': {
                    background: `${colors.primary[400]} !important`,
                },
                '& .pro-icon-wrapper': {
                    backgroundColor: 'transparent !important',
                },
                '& .pro-inner-item': {
                    padding: '5px 35px 5px 20px !important',
                },
                '& .pro-inner-item:hover': {
                    color: '#868dfb !important',
                },
                '& .pro-menu-item.active': {
                    color: '#6870fa !important',
                },
            }}
        >
            <ProSidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{
                            margin: '10px 0 20px 0',
                            color: colors.grey[100],
                        }}
                    >
                        {!isCollapsed && (
                            <Box display="flex" justifyContent="space-between" alignItems="center" ml="10px">
                                <Typography variant="h3" color={colors.grey[100]}>
                                    <img
                                        className="navbar-logo"
                                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/12/Logo-Truong-Dai-hoc-Greenwich-Viet-Nam.png"
                                        height="40"
                                        alt="logo-greenwich"
                                        loading="lazy"
                                    />
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box textAlign="center">
                                <Typography
                                    variant="h3"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                    sx={{ m: '10px 0 0 0' }}
                                >
                                    {fullName}
                                </Typography>
                                <Typography variant="h5" color={colors.greenAccent[500]}>
                                    {role ? role : 'Unknown Role'}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : '10%'}>
                        {isManager && (
                            <>
                                <Item
                                    title="Dashboard"
                                    to="/manager"
                                    icon={<HomeOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            </>
                        )}

                        {isCoordinator && (
                            <>
                                <Item
                                    title="Dashboard"
                                    to="/coordinator"
                                    icon={<HomeOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            </>
                        )}
                        {isAdmin && (
                            <>
                                <Item
                                    title="Dashboard"
                                    to="/admin"
                                    icon={<HomeOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Typography variant="h6" color={colors.grey[300]} sx={{ m: '15px 0 5px 20px' }}>
                                    Management
                                </Typography>
                                <Item
                                    title="Users"
                                    to="/admin/users"
                                    icon={<PeopleOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="Create Users"
                                    to="/admin/form"
                                    icon={<PersonOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="Deadlines"
                                    to="/admin/deadlines"
                                    icon={<AccessTimeOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="Faculty"
                                    to=""
                                    icon={<CalendarTodayOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="Roles"
                                    to=""
                                    icon={<HelpOutlineOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Typography variant="h6" color={colors.grey[300]} sx={{ m: '15px 0 5px 20px' }}>
                                    Reports
                                </Typography>
                                <Item
                                    title="Statistics"
                                    to="/admin/statistics"
                                    icon={<EqualizerOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />

                                <Typography variant="h6" color={colors.grey[300]} sx={{ m: '15px 0 5px 20px' }}>
                                    Analysis
                                </Typography>
                                <Item
                                    title="Bar Chart"
                                    to="/admin/bar"
                                    icon={<BarChartOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="Pie Chart"
                                    to="/admin/pie"
                                    icon={<PieChartOutlineOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="Line Chart"
                                    to="/admin/line"
                                    icon={<TimelineOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                <Item
                                    title="Geography Chart"
                                    to="/admin/geography"
                                    icon={<MapOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            </>
                        )}

                        <Typography variant="h6" color={colors.grey[300]} sx={{ m: '15px 0 5px 20px' }}>
                            Pages
                        </Typography>
                        <Item
                            title="Calendar"
                            to="/calendar"
                            icon={<CalendarTodayOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="FAQ Page"
                            to="/faq"
                            icon={<HelpOutlineOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;
