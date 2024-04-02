import { Box, IconButton, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import Header from '../../../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

import { selectCurrentListUsers, setUsers } from '~/feature/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllUserQuery, useUpdateUserMutation, useDeleteUserMutation } from '~/feature/user/userApiSlice';
import { useEffect, useState } from 'react';
import { useGetAllFacultiesQuery } from '~/feature/faculty/facultyApiSlice';
import { selectFaculties, setFaculties } from '~/feature/faculty/facultySlice';

const Users = () => {
    const dispatch = useDispatch();
    const [formUser, setFormUser] = useState({});
    const { data: users } = useGetAllUserQuery();
    const { data: facultiesData } = useGetAllFacultiesQuery();
    const faculties = useSelector(selectFaculties);
    const userObjects = useSelector(selectCurrentListUsers);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        setRows(formUser);
    }, [formUser]);

    useEffect(() => {
        if (users) {
            dispatch(setUsers(users));
        }
        if (facultiesData) {
            dispatch(setFaculties(facultiesData));
        }
    }, [dispatch, users, facultiesData]);

    useEffect(() => {
        if (users && faculties) {
            const formUserObjects = users.map((user) => {
                const facultyObj = faculties.find((fac) => fac.id === user.facultiesId);
                const facultyName = facultyObj ? facultyObj.facultyName : 'Unknown Faculty';
                return {
                    id: user.id,
                    userName: user.userName,
                    email: user.email,
                    phone: user.phoneNumber,
                    faculties: facultyName,
                };
            });
            setFormUser(formUserObjects);
        }
    }, [users, faculties]);

    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'userName',
            headerName: 'Name',
            flex: 1,
            cellClassName: 'name-column--cell',
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
        },
        {
            field: 'phone',
            headerName: 'Phone Number',
            flex: 1,
        },
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
        },
        {
            field: 'faculties',
            headerName: 'Faculty Name',
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <IconButton aria-label="update" size="large">
                        <ModeEditOutlineIcon />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => {
                            handleDelete(params.row.id);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    const handleUpdate = (user) => {
        // Update the user here
        updateUser(user)
            .then(() => {
                toast.success('User updated successfully');
            })
            .catch(() => {
                toast.error('Failed to update user');
            });
    };

    const handleDelete = (userId) => {
        // Delete the user here
        deleteUser(userId)
            .then(() => {
                toast.success('User deleted successfully');
                setRows(rows.filter((row) => row.id !== userId));
            })
            .catch(() => {
                toast.error('Failed to delete user');
            });
    };

    return (
        <Box m="20px">
            <ToastContainer />
            <Header title="TEAM" subtitle="Managing the Team Members" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    '& .MuiDataGrid-root': {
                        border: 'none',
                    },
                    '& .MuiDataGrid-cell': {
                        borderBottom: 'none',
                    },
                    '& .name-column--cell': {
                        color: colors.greenAccent[300],
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: 'none',
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        backgroundColor: colors.primary[400],
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: 'none',
                        backgroundColor: colors.blueAccent[700],
                    },
                    '& .MuiCheckbox-root': {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                {userObjects ? (
                    <DataGrid checkboxSelection disableRowSelectionOnClick rows={rows} columns={columns} />
                ) : (
                    <div>Loading...</div>
                )}
            </Box>
        </Box>
    );
};

export default Users;
