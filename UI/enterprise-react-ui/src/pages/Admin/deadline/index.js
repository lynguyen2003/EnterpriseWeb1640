import { Box, IconButton, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import Header from '../../../components/Header';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Stack } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { useGetAllClosureDatesQuery } from '~/feature/closureDates/dateApiSlice';

const Deadlines = () => {
    const theme = useTheme();
    const [formData, setFormData] = useState({});
    const colors = tokens(theme.palette.mode);
    const { data: closureDates, isLoading } = useGetAllClosureDatesQuery();
    const [rows, setRows] = useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 60 },
        {
            field: 'academicYear',
            headerName: 'Academic Year',
            width: 180,
            editable: true,
            flex: 1,
        },
        {
            field: 'closureDate',
            headerName: 'Submission Date',
            type: 'DateTime',
            width: 220,
            editable: true,
            flex: 1,
        },
        {
            field: 'finalClosureDate',
            headerName: 'Final Submission Date',
            type: 'DateTime',
            width: 220,
            editable: true,
            flex: 1,
            renderCell: (params) => (
                <TextField
                    value={params.value}
                    type="datetime-local"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            ),
            renderEditCell: (params) => (
                <TextField
                    value={params.value}
                    type="datetime-local"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event) => {}}
                />
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            width: 100,
            getActions: () => [
                <Stack direction="row" spacing={1}>
                    <IconButton aria-label="update" size="large">
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" size="large">
                        <DeleteIcon />
                    </IconButton>
                </Stack>,
            ],
        },
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.getFullYear().toString();
    };

    useEffect(() => {
        setRows(formData);
    }, [formData]);

    useEffect(() => {
        if (closureDates) {
            const formDataObjects = closureDates.map((date) => {
                return {
                    id: date.id,
                    academicYear: formatDate(date.academicYear),
                    closureDate: date.closureDate,
                    finalClosureDate: date.finalClosureDate,
                };
            });
            setFormData(formDataObjects);
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
