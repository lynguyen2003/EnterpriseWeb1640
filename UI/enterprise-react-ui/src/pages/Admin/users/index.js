import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Box, IconButton, Select, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import Header from '../../../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

import { setUsers } from '~/feature/user/userSlice';
import { useGetAllUserQuery, useUpdateUserMutation, useDeleteUserMutation } from '~/feature/user/userApiSlice';
import { useGetAllFacultiesQuery } from '~/feature/faculty/facultyApiSlice';
import { selectFaculties, setFaculties } from '~/feature/faculty/facultySlice';
import { useGetUserRoleMutation, useAddUserToRoleMutation } from '~/feature/role/roleApiSlice';

const Users = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [formUser, setFormUser] = useState([]);
    const [formData, setFormData] = useState({
        userName: '',
        fullName: '',
        email: '',
        phone: '',
        role: '',
        facultiesId: '',
    });
    const [roleFormData, setRoleFormData] = useState({
        email: '',
        oldRoleName: '',
        roleName: '',
    });
    const { data: users, refetch } = useGetAllUserQuery();
    const { data: facultiesData } = useGetAllFacultiesQuery();
    const [getUserRole] = useGetUserRoleMutation();
    const [addUserToRole] = useAddUserToRoleMutation();
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
            const formUserObjects = users.map(async (user) => {
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
            Promise.all(formUserObjects).then(setFormUser);
        }
    }, [users, faculties, getUserRole]);

    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

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

    const handleUpdateClick = (id) => {
        const row = formUser.find((row) => row.id === id);
        setFormData(row);
        setOpen(true);
    };

    const handleRoleInputChange = (e) => {
        setRoleFormData({
            ...roleFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRoleSubmit = async (e) => {
        try {
            await addUserToRole(roleFormData).unwrap();
            toast.success('Role updated successfully');
            setOpenRoleDialog(false);
        } catch (error) {
            toast.error(`Failed to update role: ${error.message}`);
        }
    };

    console.log(formData);

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
                toast.success('User updated successfully');
                // Close the dialog and reset the editRow and formData states
                setOpen(false);

                setFormData({
                    userName: '',
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    role: '',
                    facultiesId: '',
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
                toast.success('User deleted successfully');
                setFormUser(formUser.filter((row) => row.id !== userId));
            })
            .catch(() => {
                toast.error('Failed to delete user');
            });
    };

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
                <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)}>
                    <DialogTitle>Update Role</DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleRoleSubmit}>
                            <TextField
                                name="email"
                                label="Email"
                                fullWidth
                                margin="normal"
                                value={roleFormData.email}
                                onChange={handleRoleInputChange}
                                required
                            />
                            <TextField
                                name="oldRoleName"
                                label="Old Role Name"
                                fullWidth
                                margin="normal"
                                value={roleFormData.oldRoleName}
                                onChange={handleRoleInputChange}
                            />
                            <TextField
                                name="roleName"
                                label="Role Name"
                                fullWidth
                                margin="normal"
                                value={roleFormData.roleName}
                                onChange={handleRoleInputChange}
                                required
                            />
                            <DialogActions>
                                <Button onClick={() => setOpenRoleDialog(false)} color="primary">
                                    Cancel
                                </Button>
                                <Button type="submit" color="secondary">
                                    Submit
                                </Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
                <Button variant="outlined" onClick={() => setOpenRoleDialog(true)}>
                    Update Role
                </Button>

                <Dialog open={open} onClose={() => setOpen(false)}>
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
                        <InputLabel id="demo-select-small-label">Faculties</InputLabel>
                        <Select
                            label="Faculties"
                            fullWidth
                            onChange={(e) => setFormData({ ...formData, facultiesId: e.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {faculties.map((faculty) => (
                                <MenuItem key={faculty.id} value={faculty.id}>
                                    {faculty.facultyName}
                                </MenuItem>
                            ))}
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} color="secondary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>

                {formUser ? (
                    <DataGrid
                        checkboxSelection
                        disableRowSelectionOnClick
                        rows={formUser}
                        columns={columns}
                        {...formUser}
                        initialState={{
                            ...formUser.initialState,
                            pagination: { paginationModel: { pageSize: 5 } },
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

export default Users;
