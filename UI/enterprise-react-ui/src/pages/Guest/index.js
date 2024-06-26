import React, { useState, useEffect } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { fileDb } from '~/Config';
import { ref, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';

import { useGetAllContributionWithFilterQuery } from '~/feature/contribution/contributionApiSlice';
import { useGetUserByUserIdMutation } from '~/feature/user/userApiSlice';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const Guest = () => {
    const [imageUrls, setImageUrls] = useState({});
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [isApproved] = useState(true);
    const [selectedContribution, setSelectedContribution] = useState(null);
    const [selectedUser, setSelectedUser] = useState({});

    const { data: contributionsObj } = useGetAllContributionWithFilterQuery(isApproved);
    const [getUserByUserId, { data: userData }] = useGetUserByUserIdMutation();

    console.log(selectedUser);

    useEffect(() => {
        if (selectedContribution) {
            getUserByUserId(selectedContribution.usersId);
        }
    }, [selectedContribution, getUserByUserId]);

    useEffect(() => {
        if (userData) {
            setSelectedUser(userData);
        }
    }, [userData]);

    useEffect(() => {
        if (Array.isArray(contributionsObj)) {
            contributionsObj.forEach((contribution) => {
                // your code here
                handleDisplayImg(contribution.imgPath);
            });
        }
    }, [contributionsObj]);

    const handleDisplayImg = async (imgPath) => {
        const imageRef = ref(fileDb, `images/${imgPath}`);
        const url = await getDownloadURL(imageRef);
        setImageUrls((prevUrls) => ({ ...prevUrls, [imgPath]: url }));
    };

    const handleDownloadFile = async (fileName) => {
        try {
            const fileRef = ref(fileDb, `files/${fileName}`);
            const downloadURL = await getDownloadURL(fileRef);
            window.open(downloadURL, '_blank');
        } catch (error) {
            console.error('Error download:', error);
            toast.error('Download failed');
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box
            sx={{
                flexGrow: 1,
                marginTop: '150px',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '95%',
            }}
        >
            <ToastContainer />
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {contributionsObj &&
                    contributionsObj.slice((page - 1) * 8, page * 8).map((contribution, index) => (
                        <Grid item xs={3} key={index}>
                            <Card
                                sx={{
                                    maxWidth: 345,
                                    height: '100%',
                                    margin: 'auto',
                                }}
                            >
                                <CardActionArea
                                    onClick={() => {
                                        setSelectedContribution(contribution);
                                        handleClickOpen();
                                    }}
                                >
                                    <CardMedia
                                        sx={{ height: 140 }}
                                        image={imageUrls[contribution.imgPath]}
                                        title={contribution.imgPath}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {contribution.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.primary">
                                            {contribution.description.length > 100
                                                ? `${contribution.description.slice(0, 40)}...`
                                                : contribution.description}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Upload: {new Date(contribution.uploadDate).toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button size="small" onClick={() => handleDownloadFile(contribution.filePath)}>
                                        Download Document
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
            <Pagination
                count={
                    contributionsObj
                        ? Math.ceil(contributionsObj.filter((contribution) => contribution.isApproved).length / 8)
                        : 0
                }
                onChange={(event, value) => setPage(value)}
                renderItem={(item) => (
                    <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                )}
            />
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth="1000px"
            >
                <DialogTitle sx={{ m: 0, p: 2, width: '850px' }} id="customized-dialog-title">
                    {selectedContribution ? selectedContribution.title : 'Loading...'}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent
                    dividers
                    sx={{
                        height: '100%',
                    }}
                >
                    {selectedContribution ? (
                        <>
                            <CardMedia
                                component="img"
                                sx={{ height: 350, objectFit: 'inherit', margin: 'auto', marginBlockEnd: '20px' }}
                                image={imageUrls[selectedContribution.imgPath]}
                                title={selectedContribution.imgPath}
                            />
                            <Typography variant="body1" gutterBottom>
                                {selectedContribution.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Upload: {new Date(selectedContribution.uploadDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Author: {selectedUser ? selectedUser[0]?.fullName : 'Loading...'}
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body1" gutterBottom>
                            Loading...
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Typography>{selectedContribution ? selectedContribution.filePath : 'Loading...'}</Typography>
                    <Button autoFocus onClick={() => handleDownloadFile(selectedContribution.filePath)}>
                        Download Document
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </Box>
    );
};
export default Guest;
