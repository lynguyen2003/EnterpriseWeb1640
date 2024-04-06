import React, { useEffect, useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { tokens } from '~/theme';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import Header from '~/components/Header';
import { DataGrid } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import { useGetAllContributionQuery } from '~/feature/contribution/contributionApiSlice';
import { ref, getDownloadURL, getStorage, listAll } from 'firebase/storage';
import { useGetUserByUserIdMutation } from '~/feature/user/userApiSlice';
import { fileDb } from '~/Config';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [users, setUsers] = useState([]);
    const { data: contributions, error, isLoading } = useGetAllContributionQuery();
    const [getUserByUserId] = useGetUserByUserIdMutation();

    useEffect(() => {
        if (!isLoading && !error && contributions) {
            const fetchUsers = async () => {
                const fetchedUsers = await Promise.all(
                    contributions.map((contribution) => {
                        const result = getUserByUserId({ userId: contribution.usersId }).unwrap();
                        return result;
                    }),
                );
                setUsers(fetchedUsers);
            };

            fetchUsers();
            setRows(contributions);
        }
    }, [contributions, error, isLoading, getUserByUserId]);

    const handleDownloadFile = async (fileName) => {
        try {
            const fileRef = ref(fileDb, `files/${fileName}`);
            const downloadURL = await getDownloadURL(fileRef);
            window.open(downloadURL, '_blank');
            toast.success('Download successfully');
        } catch (error) {
            console.error('Error download:', error);
            toast.error('Download failed');
        }
    };

    const handleDownloadImg = async (imgName) => {
        try {
            const imageRef = ref(fileDb, `images/${imgName}`);
            const downloadURL = await getDownloadURL(imageRef);
            window.open(downloadURL);
            toast.success('Download successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Download failed');
        }
    };

    const handleDownloadAll = async () => {
        const storage = getStorage();
        const storageRef = ref(storage, 'files');

        try {
            const res = await listAll(storageRef);
            const downloadPromises = res.items.map((itemRef) => getDownloadURL(itemRef));
            const downloadURLs = await Promise.all(downloadPromises);

            downloadURLs.forEach((url) => {
                const link = document.createElement('a');
                link.href = url;
                link.download = url.split('/').pop();
                link.click();
            });

            toast.success('Downloaded all files successfully');
        } catch (error) {
            console.error('Error downloading all files:', error);
            toast.error('Failed to download all files.');
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
        },
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1,
        },
        {
            field: 'uploadDate',
            headerName: 'Upload Date',
            flex: 1,
        },
        {
            field: 'filePath',
            headerName: 'Download File',
            flex: 1,
            renderCell: (params) => (
                <a
                    href={params.value}
                    onClick={(event) => {
                        event.preventDefault();
                        handleDownloadFile(params.value);
                    }}
                >
                    {params.value}
                </a>
            ),
        },
        {
            field: 'imgPath',
            headerName: 'Download Image',
            flex: 1,

            renderCell: (params) => (
                <MenuItem
                    href={params.value}
                    onClick={(event) => {
                        event.preventDefault();
                        handleDownloadImg(params.value);
                    }}
                >
                    {params.value}
                </MenuItem>
            ),
        },
        {
            field: 'magazinesId',
            headerName: 'Magazine',
            flex: 1,
        },
    ];

    return (
        <Box m="20px">
            {/* HEADER */}
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: '14px',
                            fontWeight: 'bold',
                            padding: '10px 20px',
                        }}
                    >
                        <DownloadOutlinedIcon sx={{ mr: '10px' }} />
                        Download Reports
                    </Button>
                </Box>
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
                    <DataGrid checkboxSelection disableRowSelectionOnClick rows={rows} columns={columns} />
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
