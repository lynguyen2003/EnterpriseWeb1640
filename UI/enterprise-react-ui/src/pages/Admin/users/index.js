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
import { TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { selectCurrentListUsers, setUsers } from '~/feature/user/userSlice';
import { useGetAllUserQuery, useUpdateUserMutation, useDeleteUserMutation } from '~/feature/user/userApiSlice';
import { useGetAllFacultiesQuery } from '~/feature/faculty/facultyApiSlice';
import { selectFaculties, setFaculties } from '~/feature/faculty/facultySlice';
import MenuItem from '@mui/material/MenuItem';

const Users = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const [editRow, setEditRow] = useState(null);
    const [open, setOpen] = useState(false);
    const [formUser, setFormUser] = useState({});
    const [rows, setRows] = useState([]);
    const [facultiesOption, setFacultiesOption] = useState('');
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        phoneNumber: '',
        role: '',
        facultiesId: '',
    });
    const { data: users, refetch } = useGetAllUserQuery();
    const { data: facultiesData } = useGetAllFacultiesQuery();
    const faculties = useSelector(selectFaculties);
    const userObjects = useSelector(selectCurrentListUsers);

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
                    facultiesId: user.facultiesId,
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
    const handleChange = (event) => {
        setFacultiesOption(event.target.value);
    };

    const handleUpdateClick = (id) => {
        const row = rows.find((row) => row.id === id);
        setEditRow(row);
        setOpen(true);
    };

    const handleUpdate = () => {
        // Update the user here
        updateUser({ ...formData, id: editRow.id })
            .unwrap()
            .then((payload) => {
                toast.success('User updated successfully');
                // Close the dialog and reset the editRow and formData states
                setOpen(false);
                setEditRow(null);
                setFormData({
                    userName: '',
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
                setRows(rows.filter((row) => row.id !== userId));
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
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value }, handleChange)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <InputLabel id="demo-select-small-label">Faculties</InputLabel>
                        <Select
                            label="Faculties"
                            fullWidth
                            value={formUser.faculties}
                            onChange={(e) => setFormData({ ...formData, facultiesId: e.target.value }, handleChange)}
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
                                setEditRow(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate}>Update</Button>
                    </DialogActions>
                </Dialog>

                {formUser ? (
                    <DataGrid checkboxSelection disableRowSelectionOnClick rows={rows} columns={columns} />
                ) : (
                    <div>Loading...</div>
                )}
            </Box>
        </Box>
    );
};

export default Users;
