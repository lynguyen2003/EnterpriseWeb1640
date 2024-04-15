import React, { useEffect, useState } from 'react';

import { tokens } from '../../../theme';
import { Box, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from '../../../components/Header';
import { ToastContainer, toast } from 'react-toastify';

import { useGetStatisticsQuery } from '~/feature/statistics/statisticsApiSlice';

const Statistics = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

    const { data, error } = useGetStatisticsQuery();

    useEffect(() => {
        if (data) {
            const dataWithIds = data.map((row, index) => ({ id: index + 1, ...row }));
            setRows(dataWithIds);
        }
        if (error) {
            toast.error('Failed to fetch data');
        }
    }, [data, error]);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
        },
        {
            field: 'facultyName',
            headerName: 'Faculty Name',
            flex: 1,
        },
        {
            field: 'contributionCount',
            headerName: 'Number of Contribution',
            flex: 1,
        },
        {
            field: 'academicYear',
            headerName: 'Academic Year',
            flex: 1,
        },
    ];

    return (
        <Box m="20px">
            <ToastContainer />
            <Header title="Statistics" subtitle="Number of contributions within each Faculty for each academic year." />
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
                    getRowId={(row) => row.facultyName + row.academicYear}
                />
            </Box>
        </Box>
    );
};

export default Statistics;
