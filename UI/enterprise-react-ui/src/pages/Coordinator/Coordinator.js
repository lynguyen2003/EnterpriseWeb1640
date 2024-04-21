import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
    TextField,
    List,
    ListItemText,
    ListItem,
    styled,
    Grid,
    Paper,
    Switch,
    FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '~/theme';
import Header from '~/components/Header';
import { ref, getDownloadURL } from 'firebase/storage';
import { fileDb } from '~/Config';
import { ToastContainer, toast } from 'react-toastify';

import { useGetAllContributionQuery } from '~/feature/contribution/contributionApiSlice';
import { useGetUserByUserIdMutation } from '~/feature/user/userApiSlice';
import { useGetFacultyByIdMutation } from '~/feature/faculty/facultyApiSlice';
import { selectCurrentEmail } from '~/feature/auth/authSlice';
import { useGetUserByEmailQuery } from '~/feature/user/userApiSlice';
import { useGetCommentsByContributionIdMutation, useAddCommentMutation } from '~/feature/comment/commentApiSlice';
import { usePutContributionMutation } from '~/feature/contribution/contributionApiSlice';

const Coordinator = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const { data: contributions, error, isLoading, refetch } = useGetAllContributionQuery();
    const [getUserByUserId] = useGetUserByUserIdMutation();
    const [getFacultyById] = useGetFacultyByIdMutation();
    const [getComments] = useGetCommentsByContributionIdMutation();
    const [postComment] = useAddCommentMutation();
    const [updateContribution] = usePutContributionMutation();
    const email = useSelector(selectCurrentEmail);
    const { data: currentUser } = useGetUserByEmailQuery(email);

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
                        facultiesId: fetchedFaculties[index].id,
                        uploadDate: formattedUploadDate,
                    };
                });

                const filteredContributions = contributionsWithUsersAndFaculties.filter(
                    (contribution) =>
                        currentUser &&
                        currentUser.length > 0 &&
                        contribution.facultiesId === currentUser[0].facultiesId,
                );

                setRows(filteredContributions);
            };

            fetchUsers();
        }
    }, [contributions, error, isLoading, getUserByUserId, getFacultyById, currentUser]);

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

    const handleCommentChange = (event) => {
        event.persist();
        setComment(event.target.value);
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        try {
            const commentData = {
                contributionId: selectedRow.id,
                content: comment,
                email: currentUser[0].email,
                userName: currentUser[0].userName,
            };
            await postComment(commentData).unwrap();
            setComments([...comments, commentData]);
            setComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Failed to post comment');
        }
    };

    const handleSetApprove = async (row) => {
        try {
            const updatedRow = {
                ...row,
                isApproved: !row.isApproved,
            };

            await updateContribution(updatedRow).unwrap();

            refetch();
        } catch (error) {
            console.error('Error approving:', error);
            toast.error('Failed to approve');
        }
    };

    const handleSetPublish = async (row) => {
        try {
            const updatedRow = {
                ...row,
                isPublished: !row.isPublished,
            };

            await updateContribution(updatedRow).unwrap();

            refetch();
        } catch (error) {
            console.error('Error publishing:', error);
            toast.error('Failed to publish');
        }
    };

    const handleAccordionToggle = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
        if (newExpanded) {
            const fetchComments = async () => {
                const fetchedComments = await getComments(selectedRow.id).unwrap();
                if (Array.isArray(fetchedComments)) {
                    setComments(fetchedComments);
                } else {
                    toast.error('Failed to fetch comments');
                    console.error('Fetched comments is not an array:', fetchedComments);
                }
            };

            fetchComments();
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', witdh: 50 },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
        },
        {
            field: 'title',
            headerName: 'Title',
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
            field: 'viewDetails',
            headerName: '',
            flex: 1,
            renderCell: (params) => (
                <Button
                    onClick={() => handleViewDetails(params.row)}
                    sx={{
                        color: colors.grey[300],
                        fontSize: '12px',
                        fontWeight: 'bold',
                        padding: '10px 20px',
                    }}
                >
                    Details
                </Button>
            ),
        },

        {
            field: 'approve',
            headerName: 'Approved',
            flex: 1,
            renderCell: (params) => (
                <FormControlLabel
                    control={
                        <IOSSwitch
                            sx={{ m: 1 }}
                            defaultChecked={params.row.isApproved}
                            onChange={() => handleSetApprove(params.row)}
                        />
                    }
                />
            ),
        },
        {
            field: 'published',
            headerName: 'Published',
            flex: 1,
            renderCell: (params) => (
                <FormControlLabel
                    control={
                        <IOSSwitch
                            sx={{ m: 1 }}
                            defaultChecked={params.row.isPublished}
                            onChange={() => handleSetPublish(params.row)}
                        />
                    }
                />
            ),
        },
    ];

    return (
        <Box m="20px">
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

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
                    {...rows}
                    initialState={{
                        ...rows.initialState,
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                />
            </Box>
            {selectedRow && (
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    sx={{ '& .MuiDialog-paper': { maxWidth: 'fit-content' } }}
                >
                    <DialogTitle>
                        <Typography variant="h5" sx={{ color: colors.blueAccent[700], fontWeight: 800, fontSize: 22 }}>
                            Contribution Details
                        </Typography>
                    </DialogTitle>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            width="100%"
                        >
                            <Typography
                                sx={{
                                    fontSize: '22px',
                                }}
                            >
                                {selectedRow.title}
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            <Typography>
                                <Grid container marginBlockEnd={5}>
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

                            <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionToggle('panel1')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    width="100%"
                                    sx={{ fontSize: '18px' }}
                                >
                                    FeedBack
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid item xs={4} marginBlockEnd={2}>
                                        <List
                                            sx={{
                                                py: 0,
                                                width: '100%',
                                                maxWidth: 360,
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                backgroundColor: 'background.paper',
                                            }}
                                        >
                                            {comments.map((comment, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText
                                                        primary={
                                                            <>
                                                                {comment.userName} -{' '}
                                                                <Typography
                                                                    sx={{
                                                                        display: 'inline',
                                                                        fontStyle: 'italic',
                                                                        color: 'text.secondary',
                                                                    }}
                                                                    component="span"
                                                                >
                                                                    {comment.email}
                                                                </Typography>
                                                            </>
                                                        }
                                                        secondary={
                                                            <>
                                                                <Typography
                                                                    sx={{ display: 'inline' }}
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.primary"
                                                                >
                                                                    {comment.content}
                                                                </Typography>
                                                                {' — ' + new Date(comment.createdAt).toLocaleString()}
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <form onSubmit={handlePostComment}>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Comment"
                                                multiline
                                                rows={2}
                                                variant="outlined"
                                                fullWidth
                                                value={comment}
                                                onChange={handleCommentChange}
                                            />
                                            <Button variant="outlined" type="submit" style={{ marginTop: '10px' }}>
                                                Post Comment
                                            </Button>
                                        </form>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                </Dialog>
            )}
            <ToastContainer />
        </Box>
    );
};

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
    ({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                    opacity: 1,
                    border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
        },
    }),
);

export default Coordinator;
