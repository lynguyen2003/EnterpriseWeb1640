import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    useTheme,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Dialog,
    DialogTitle,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '~/theme';
import Header from '~/components/Header';
import { ref, getDownloadURL } from 'firebase/storage';
import { fileDb } from '~/Config';
import { toast } from 'react-toastify';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { useGetContributionApprovedQuery } from '~/feature/contribution/contributionApiSlice';
import { useGetUserByUserIdMutation } from '~/feature/user/userApiSlice';
import { useGetFacultyByIdMutation } from '~/feature/faculty/facultyApiSlice';

const ManagerContributions = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [open, setOpen] = useState(false);
    const [isApproved] = useState(true);
    const { data: contributions, error, isLoading } = useGetContributionApprovedQuery(isApproved);
    const [getUserByUserId] = useGetUserByUserIdMutation();
    const [getFacultyById] = useGetFacultyByIdMutation();

    useEffect(() => {
        if (!isLoading && !error && contributions) {
            const fetchUsers = async () => {
                const fetchedUsers = await Promise.all(
                    contributions.map((contribution) => {
                        return getUserByUserId(contribution.usersId).unwrap();
                    }),
                );

                const fetchedFaculties = await Promise.all(
                    fetchedUsers.map((user) => {
                        return getFacultyById(user[0].facultiesId).unwrap();
                    }),
                );

                const contributionsWithUsersAndFaculties = contributions.map((contribution, index) => {
                    const formattedUploadDate = new Date(contribution.uploadDate).toLocaleString();
                    return {
                        ...contribution,
                        email: fetchedUsers[index][0].email,
                        facultyName: fetchedFaculties[index].facultyName,
                        uploadDate: formattedUploadDate,
                    };
                });
                setRows(contributionsWithUsersAndFaculties);
            };

            fetchUsers();
        }
    }, [contributions, error, isLoading, getUserByUserId, getFacultyById]);

    useEffect(() => {
        if (selectedRow) {
            const imageRef = ref(fileDb, `images/${selectedRow.imgPath}`);
            getDownloadURL(imageRef)
                .then((url) => {
                    setImageUrl(url);
                })
                .catch((error) => {
                    console.error('Error getting image URL: ', error);
                });
        }
    }, [selectedRow]);

    const Item = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: '16px',
    }));

    const handleViewDetails = (row) => {
        setSelectedRow(row);
        setOpen(true);
    };

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

    /* const handleDownloadImg = async (imgName) => {
        try {
            const imgRef = ref(fileDb, `images/${imgName}`);
            const downloadURL = await getDownloadURL(imgRef);
            window.open(downloadURL, '_blank');
            toast.success('Download successfully');
        } catch (error) {
            console.error('Error download:', error);
            toast.error('Download failed');
        }
    }; */

    const handleDownloadAllFiles = async () => {
        const zip = new JSZip();

        for (const fileName of selectedFiles) {
            try {
                const fileRef = ref(fileDb, `files/${fileName}`);
                const downloadURL = await getDownloadURL(fileRef);
                const response = await fetch(downloadURL, { mode: 'no-cors' });
                const blob = await response.blob();
                zip.file(fileName, blob, { binary: true });
            } catch (error) {
                console.error('Error download:', error);
                toast.error(`Download failed for file ${fileName}`);
            }
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, 'selected-contributions.zip');
        });
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        {
            field: 'email',
            headerName: 'Email',
            width: 180,
        },
        {
            field: 'title',
            headerName: 'Title',
            width: 100,
        },
        {
            field: 'uploadDate',
            headerName: 'Upload Date',
            width: 120,
        },
        {
            field: 'facultyName',
            headerName: 'Faculties',
            width: 150,
        },
        {
            field: 'filePath',
            headerName: 'Download File',
            width: 150,
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
            field: 'viewDetails',
            headerName: '',
            width: 150,
            flex: 1,
            renderCell: (params) => (
                <Button
                    onClick={() => handleViewDetails(params.row)}
                    sx={{
                        color: colors.grey[100],
                        fontSize: '12px',
                        fontWeight: 'bold',
                        padding: '10px 20px',
                    }}
                >
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

                <Button
                    disabled={selectedFiles.length === 0}
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: '14px',
                        fontWeight: 'bold',
                        padding: '10px 20px',
                    }}
                    onClick={() => handleDownloadAllFiles(selectedFiles)}
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
                <DataGrid
                    checkboxSelection
                    disableRowSelectionOnClick
                    rows={rows}
                    columns={columns}
                    onRowSelectionModelChange={(newSelection) => {
                        const selectedData = newSelection.map((id) => rows.find((row) => row.id === id));
                        setSelectedFiles(selectedData.map((data) => data.filePath));
                    }}
                    {...rows}
                    initialState={{
                        ...rows.initialState,
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                />
            </Box>
            {selectedRow && (
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    sx={{ '& .MuiDialog-paper': { maxWidth: 'fit-content' } }}
                >
                    <DialogTitle
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 800, fontSize: 18 }}>
                            Contribution Details
                        </Typography>
                    </DialogTitle>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            width="100%"
                            sx={{
                                backgroundColor: colors.blueAccent[900],
                                color: colors.grey[100],
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '16px',
                                    color: colors.grey[100],
                                }}
                            >
                                {selectedRow.title}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <Grid container>
                                    <Grid xs={4}>
                                        <Item>Title</Item>
                                    </Grid>
                                    <Grid xs={8}>
                                        <Item>{selectedRow.title}</Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Item>Description</Item>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Item style={{ overflowWrap: 'break-word', wordWrap: 'break-word' }}>
                                            {selectedRow.description}
                                        </Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Item>Upload Date</Item>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Item>{selectedRow.uploadDate}</Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Item>Student</Item>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Item>{selectedRow.email}</Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Item>Image</Item>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Item>
                                            {imageUrl && (
                                                <img
                                                    src={imageUrl}
                                                    alt="Contribution"
                                                    style={{ width: '500px', height: '350px' }}
                                                />
                                            )}
                                        </Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Item>File</Item>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Item>
                                            <a
                                                href={selectedRow.filePath}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    handleDownloadFile(selectedRow.filePath);
                                                }}
                                            >
                                                {selectedRow.filePath}
                                            </a>
                                        </Item>
                                    </Grid>
                                </Grid>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Dialog>
            )}
        </Box>
    );
};

export default ManagerContributions;
