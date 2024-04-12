import { Box, IconButton, useTheme, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import Header from '../../../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Stack } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import {
    useGetAllClosureDatesQuery,
    usePostClosureDatesMutation,
    useUpdateClosureDatesMutation,
    useDeleteClosureDatesMutation,
} from '~/feature/closureDates/dateApiSlice';

const Deadlines = () => {
    const theme = useTheme();
    const [editRow, setEditRow] = useState(null);
    const [postClosureDate] = usePostClosureDatesMutation();
    const [updateClosureDate] = useUpdateClosureDatesMutation();
    const [deleteClosureDate] = useDeleteClosureDatesMutation();
    const [formPostData, setFormPostData] = useState({
        academicYear: '',
        closureDate: '',
        finalClosureDate: '',
        isSet: '',
    });
    const [open, setOpen] = useState(false);
    const colors = tokens(theme.palette.mode);
    const { data: closureDates, isLoading, refetch } = useGetAllClosureDatesQuery();
    const [rows, setRows] = useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 60 },
        {
            field: 'academicYear',
            headerName: 'Academic Year',
            type: 'text',
            width: 180,
        },
        {
            field: 'closureDate',
            headerName: 'Submission Date',
            type: 'dateTime',
            width: 220,
        },
        {
            field: 'finalClosureDate',
            headerName: 'Final Submission Date',
            type: 'dateTime',
            width: 220,
            flex: 1,
        },
        {
            field: 'isSet',
            headerName: 'Set Date',
            type: 'text',
            width: 220,
            flex: 1,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 100,
            getActions: ({ id }) => [
                <Stack direction="row" spacing={1}>
                    <IconButton aria-label="update" size="large" onClick={() => handleUpdateClick(id)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" size="large" onClick={() => handleDeleteClick(id)}>
                        <DeleteIcon />
                    </IconButton>
                </Stack>,
            ],
        },
    ];

    const handleAdd = async () => {
        try {
            const response = await postClosureDate(formPostData);
            if (response.error) {
                throw response.error;
            }
            setFormPostData({
                academicYear: '',
                closureDate: '',
                finalClosureDate: '',
            });
            setOpen(false);
            refetch();
            toast.success('Closure Date added successfully!');
        } catch (error) {
            console.error('Failed to post closure date:', error);
            toast.error('Failed to add Closure Date.');
        }
    };

    const handleUpdateClick = (id) => {
        const row = rows.find((row) => row.id === id);
        setEditRow(row);
        setFormPostData({ ...formPostData, id: row.id });
        setOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await updateClosureDate(formPostData);
            if (response.error) {
                throw response.error;
            }
            refetch();
            setOpen(false);
            toast.success('Closure Date updated successfully!');
        } catch (error) {
            console.error('Failed to update closure date:', error);
            toast.error('Failed to update Closure Date.');
        }
    };

    const handleDeleteClick = async (id) => {
        try {
            const response = await deleteClosureDate(id);
            if (response.error) {
                throw response.error;
            }
            refetch();
        } catch (error) {
            console.error('Failed to delete closure date:', error);
            toast.error('Failed to delete Closure Date.');
        }
    };

    useEffect(() => {
        if (closureDates) {
            const formattedClosureDates = closureDates.map((date) => ({
                ...date,
                academicYear: date.academicYear,
                closureDate: new Date(date.closureDate),
                finalClosureDate: new Date(date.finalClosureDate),
            }));
            setRows(formattedClosureDates);
        }
    }, [closureDates]);

    return (
        <Box m="20px">
            <ToastContainer />
            <Header title="Deadlines" subtitle="Managing the Times" />
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
                <Button variant="outlined" onClick={() => setOpen(true)}>
                    Create Deadlines
                </Button>
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{editRow ? 'Update Closure Date' : 'Create Closure Date'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText marginBlockEnd={2}>Please enter the form.</DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="academicYear"
                            label="Academic Year"
                            type="text"
                            fullWidth
                            value={formPostData.academicYear}
                            onChange={(e) => setFormPostData({ ...formPostData, academicYear: e.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="closureDate"
                            label="Closure Date"
                            type="datetime-local"
                            fullWidth
                            value={formPostData.closureDate}
                            onChange={(e) => setFormPostData({ ...formPostData, closureDate: e.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="finalClosureDate"
                            label="Final Closure Date"
                            type="datetime-local"
                            fullWidth
                            value={formPostData.finalClosureDate}
                            onChange={(e) => setFormPostData({ ...formPostData, finalClosureDate: e.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            select
                            margin="dense"
                            id="isSet"
                            label="Set Date"
                            fullWidth
                            value={formPostData.isSet}
                            onChange={(e) => setFormPostData({ ...formPostData, isSet: e.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        >
                            <MenuItem value={true}>True</MenuItem>
                            <MenuItem value={false}>False</MenuItem>
                        </TextField>
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
                        <Button onClick={editRow ? handleUpdate : handleAdd}>{editRow ? 'Update' : 'Add'}</Button>
                    </DialogActions>
                </Dialog>
                <DataGrid
                    checkboxSelection
                    disableRowSelectionOnClick
                    rows={rows}
                    columns={columns}
                    loading={isLoading}
                />
            </Box>
        </Box>
    );
};

export default Deadlines;
