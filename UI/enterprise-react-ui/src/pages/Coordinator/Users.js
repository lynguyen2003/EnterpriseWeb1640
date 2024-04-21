import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import {
    Box,
    IconButton,
    useTheme,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '~/theme';
import Header from '~/components/Header';
import { ToastContainer, toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';

import {
    useGetUsersWithParamsQuery,
    useGetUserByEmailQuery,
    usePostUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} from '~/feature/user/userApiSlice';
import { selectCurrentEmail } from '~/feature/auth/authSlice';
import { useGetAllRolesQuery, useGetUserRoleMutation } from '~/feature/role/roleApiSlice';
import { selectFaculties, setFaculties } from '~/feature/faculty/facultySlice';
import { setUsers } from '~/feature/user/userSlice';
import { useGetAllFacultiesQuery } from '~/feature/faculty/facultyApiSlice';

const CoordinatorManageUsers = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const email = useSelector(selectCurrentEmail);
    const { data: currentUser } = useGetUserByEmailQuery(email);
    const [rows, setRows] = useState([]);
    const [formData, setFormData] = useState({
        userName: null,
        email: null,
        phoneNumber: null,
        facultiesId: currentUser ? currentUser[0].facultiesId : null,
        roleName: null,
    });
    const [params] = useState({
        email: '',
        facultiesId: currentUser ? currentUser[0].facultiesId : null,
    });

    const { data: users, refetch } = useGetUsersWithParamsQuery(params);
    const { data: facultiesData } = useGetAllFacultiesQuery();
    const { data: roles, isLoading: rolesLoading } = useGetAllRolesQuery();
    const [getUserRole] = useGetUserRoleMutation();
    const [postUser, { isError, isLoading: postUserLoading }] = usePostUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const faculties = useSelector(selectFaculties);

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
            const userObjects = users.map(async (user) => {
                const facultyObj = faculties.find((fac) => fac.id === user.facultiesId);
                const facultyName = facultyObj ? facultyObj.facultyName : 'Unknown Faculty';
                const roles = await getUserRole(user.email).unwrap();
                return {
                    id: user.id,
                    userName: user.userName,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phoneNumber,
                    facultiesId: user.facultiesId,
                    faculties: facultyName,
                    role: roles ? roles : 'Unknown Role',
                };
            });
            Promise.all(userObjects).then(setRows);
        }
    }, [users, faculties, getUserRole]);

    const handleUpdateClick = (id) => {
        const row = rows.find((row) => row.id === id);
        setFormData(row);
        setOpenUpdate(true);
    };

    const handleUpdate = () => {
        // Update the user here
        updateUser({
            id: formData.id,
            userName: formData.userName,
            fullName: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phone,
            facultiesId: formData.facultiesId,
        })
            .unwrap()
            .then((payload) => {
                setOpenUpdate(false);

                setFormData({
                    userName: '',
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    role: '',
                });
                // Update the rows state with the updated user
                refetch();
            })
            .catch((error) => {
                toast.error(`Failed to update user: ${error.message}`);
            });
    };

    const handleDelete = (userId) => {
        // Delete the user here
        deleteUser(userId)
            .then(() => {
                refetch();
            })
            .catch(() => {
                toast.error('Failed to delete user');
            });
    };

    const handleFormSubmit = async () => {
        // Form validation
        if (!formData.userName.trim()) {
            toast.error('Username is required');
            return;
        }

        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error('Valid email is required');
            return;
        }

        if (!formData.phoneNumber.trim()) {
            toast.error('Phone number is required');
            return;
        }

        if (!formData.roleName.trim()) {
            toast.error('Role is required');
            return;
        }

        try {
            await postUser(formData).unwrap();
            setFormData({
                userName: '',
                email: '',
                phoneNumber: '',
                roleName: '',
            });
            isError ? toast.error('Failed to create user') : toast.success('User created successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to create user');
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'userName',
            headerName: 'User Name',
            flex: 1,
        },
        {
            field: 'fullName',
            headerName: 'Full Name',
            flex: 1,
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
                    <IconButton aria-label="update" size="large" onClick={() => handleUpdateClick(params.row.id)}>
                        <EditIcon />
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

    return (
        <Box m="20px">
            <ToastContainer />
            <Header title="Users" subtitle="Managing the Users Account" />
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
                <Button variant="outlined" onClick={() => setOpenCreate(true)}>
                    Create User
                </Button>
                <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
                    <form onSubmit={handleFormSubmit}>
                        <DialogTitle
                            sx={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                            }}
                        >
                            Create User
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText
                                sx={{
                                    marginBottom: '10px',
                                }}
                            >
                                Fill in the details to create a new user
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                variant="filled"
                                id="userName"
                                label="Username"
                                type="text"
                                fullWidth
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                variant="filled"
                                id="fullName"
                                label="Full Name"
                                type="text"
                                fullWidth
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                variant="filled"
                                id="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                variant="filled"
                                id="phoneNumber"
                                label="Phone Number"
                                type="number"
                                fullWidth
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                variant="filled"
                                select
                                label="Role"
                                name="roleName"
                                fullWidth
                                value={formData.roleName}
                                onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                            >
                                {rolesLoading ? (
                                    <MenuItem value="">Loading...</MenuItem>
                                ) : (
                                    roles.map((role) => {
                                        if (role.name === 'Student' || role.name === 'Guest') {
                                            return <MenuItem value={role.name}>{role.name}</MenuItem>;
                                        }
                                        return null;
                                    })
                                )}
                            </TextField>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
                            {postUserLoading ? (
                                <Button disabled>Creating...</Button>
                            ) : (
                                <Button onClick={(() => setOpenCreate(false), handleFormSubmit)}>Create</Button>
                            )}
                        </DialogActions>
                    </form>
                </Dialog>

                <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
                    <DialogTitle>Update User</DialogTitle>
                    <DialogContent>
                        <DialogContentText marginBlockEnd={2}>Please enter the form.</DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="userName"
                            label="User Name"
                            type="text"
                            fullWidth
                            value={formData.userName}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="fullName"
                            label="Full Name"
                            type="text"
                            fullWidth
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email"
                            type="email"
                            fullWidth
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="phoneNumber"
                            label="Phone Number"
                            type="text"
                            fullWidth
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setOpenUpdate(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} color="secondary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>

                {rows ? (
                    <DataGrid
                        checkboxSelection
                        disableRowSelectionOnClick
                        rows={rows}
                        columns={columns}
                        {...rows}
                        initialState={{
                            ...rows.initialState,
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                    />
                ) : (
                    <div>Loading...</div>
                )}
            </Box>
        </Box>
    );
};

export default CoordinatorManageUsers;
