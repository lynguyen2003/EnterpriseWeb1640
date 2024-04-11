import React, { useState, useEffect } from 'react';
import {
    useGetContributionByUserIdQuery,
    usePutContributionMutation,
} from '~/feature/contribution/contributionApiSlice';
import { useGetUserByEmailQuery } from '~/feature/user/userApiSlice';
import { fileDb } from '~/Config';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { selectCurrentEmail } from '~/feature/auth/authSlice';
import { useGetCommentsByContributionIdMutation, useAddCommentMutation } from '~/feature/comment/commentApiSlice';

import { ToastContainer, toast } from 'react-toastify';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import {
    ListItemText,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    Input,
    FormHelperText,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

/* eslint-disable jsx-a11y/anchor-is-valid */
const ViewRecent = () => {
    const [imageUrls, setImageUrls] = useState({});
    const [file, setFile] = useState(null);
    const [img, setImg] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [updateFormData, setUpdateFormData] = useState({
        id: '',
        title: '',
        description: '',
        filePath: '',
        imgPath: '',
    });
    const currentEmail = useSelector(selectCurrentEmail);
    const { data: users } = useGetUserByEmailQuery(currentEmail);
    const userId = users[0].id;
    const [updateContribution] = usePutContributionMutation();
    const { data: contributions, refetch: refetchContributions } = useGetContributionByUserIdQuery(userId);
    const [getComments] = useGetCommentsByContributionIdMutation();
    const [postComment] = useAddCommentMutation();

    /* useEffect(() => {
        contributions.forEach((contribution) => {
            handleDisplayImg(contribution.imgPath);
        });
    }, [contributions]); */

    const Item = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: '16px',
    }));

    const handleAccordionToggle = (contributionId) => (event, newExpanded) => {
        setExpanded(newExpanded ? contributionId : false);
        if (newExpanded) {
            const fetchComments = async () => {
                const fetchedComments = await getComments(contributionId).unwrap();
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

    const handleInputChange = (event) => {
        setUpdateFormData({
            ...updateFormData,
            [event.target.name]: event.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const fileType = file.type;
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];

            if (!allowedTypes.includes(fileType)) {
                toast.error('File upload is not allowed.');
                return;
            }

            if (file.size > 5000000) {
                toast.error('File size should not exceed 5MB.');
                return;
            }

            setFile(file);
            setUpdateFormData({
                ...updateFormData,
                filePath: file.name,
            });
        }
    };

    const handleImgChange = (e) => {
        const img = e.target.files[0];
        if (img) {
            const fileType = img.type;
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

            if (!allowedTypes.includes(fileType)) {
                toast.error('Type of image is not allowed.');
                return;
            }

            if (img.size > 5000000) {
                toast.error('Image size should not exceed 5MB.');
                return;
            }

            setImg(img);
            setUpdateFormData({
                ...updateFormData,
                imgPath: img.name,
            });
        }
    };

    const handleDeleteFile = () => {
        setUpdateFormData((prevState) => ({
            ...prevState,
            filePath: '',
        }));
    };

    const handleDeleteImg = () => {
        setUpdateFormData((prevState) => ({
            ...prevState,
            imgPath: '',
        }));
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

    const handleDisplayImg = async (imgPath) => {
        const imageRef = ref(fileDb, `images/${imgPath}`);
        const url = await getDownloadURL(imageRef);
        setImageUrls((prevUrls) => ({ ...prevUrls, [imgPath]: url }));
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
                email: users[0].email,
                userName: users[0].userName,
            };
            await postComment(commentData).unwrap();
            setComments([...comments, commentData]);
            setComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Failed to post comment');
        }
    };

    const handleUpdateContribution = async (data) => {
        try {
            await updateContribution(data).unwrap();

            if (!data.filePath && updateFormData.filePath) {
                const fileRef = ref(fileDb, `files/${updateFormData.filePath}`);
                await deleteObject(fileRef);
            }

            if (!data.imgPath && updateFormData.imgPath) {
                const imgRef = ref(fileDb, `images/${updateFormData.imgPath}`);
                await deleteObject(imgRef);
            }

            await uploadBytes(ref(fileDb, `files/${data.filePath}`), file);
            await uploadBytes(ref(fileDb, `images/${data.imgPath}`), img);

            setUpdateDialogOpen(false);
            setUpdateFormData({});

            setFile(null);
            setImg(null);
            refetchContributions();
        } catch (error) {
            toast.error('Error updating contribution');
            console.error('Error updating contribution:', error);
        }
    };

    return (
        <div className="table-responsive">
            <ToastContainer />
            <table className="table table-hover">
                {(contributions || []).map((contribution, index) => (
                    <Accordion
                        key={contribution.id}
                        sx={{
                            marginBlockEnd: 2,
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index + 1}a-content`}
                            id={`panel${index + 1}a-header`}
                            onClick={() => {
                                setSelectedRow(contribution);
                                handleDisplayImg(contribution.imgPath);
                            }}
                        >
                            <Grid container>
                                <Grid item xs={3}>
                                    <Typography>{contribution.id}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{contribution.title}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{new Date(contribution.uploadDate).toLocaleString()}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <IconButton
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setUpdateFormData({
                                                ...updateFormData,
                                                id: contribution.id,
                                                title: contribution.title,
                                                description: contribution.description,
                                                filePath: contribution.filePath,
                                                imgPath: contribution.imgPath,
                                            });
                                            setUpdateDialogOpen(true);
                                        }}
                                        disabled={!selectedRow}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <Grid container marginBlockEnd={5}>
                                    <Grid xs={4}>
                                        <Item>Title</Item>
                                    </Grid>
                                    <Grid xs={8}>
                                        <Item>{contribution.title}</Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Item>Description</Item>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Item>{contribution.description}</Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Item>Upload Date</Item>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Item>{new Date(contribution.uploadDate).toLocaleString()}</Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Item>Student</Item>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Item>{contribution.email}</Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Item>Image</Item>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Item>
                                            {imageUrls[contribution.imgPath] && (
                                                <img
                                                    src={imageUrls[contribution.imgPath]}
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
                                                href={contribution.filePath}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    handleDownloadFile(contribution.filePath);
                                                }}
                                            >
                                                {contribution.filePath}
                                            </a>
                                        </Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Item>Magazine</Item>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Item>{contribution.magazinesId}</Item>
                                    </Grid>
                                </Grid>
                            </Typography>

                            <Accordion
                                expanded={expanded === `${contribution.id}`}
                                onChange={handleAccordionToggle(`${contribution.id}`)}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`${index + 1}a-content`}
                                    id={`${index + 1}a-header`}
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
                ))}
            </table>

            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                <DialogTitle>Update Contribution</DialogTitle>
                <DialogContent>
                    <TextField
                        name="id"
                        label="Id"
                        fullWidth
                        value={updateFormData.id}
                        required
                        margin="normal"
                        disabled
                    />
                    <TextField
                        name="title"
                        label="Title"
                        fullWidth
                        value={updateFormData.title}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                    />
                    <TextField
                        name="description"
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={updateFormData.description}
                        onChange={handleInputChange}
                        required
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <p>Upload File:</p>
                        <Input id="filePath" type="file" name="filePath" onChange={handleFileChange} required />
                        <FormHelperText>Only Word documents and PDF files are allowed.</FormHelperText>
                        {updateFormData.filePath && (
                            <div>
                                <p>
                                    {updateFormData.filePath}
                                    <IconButton onClick={handleDeleteFile}>
                                        <DeleteIcon />
                                    </IconButton>
                                </p>
                            </div>
                        )}
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <p>Upload Image:</p>
                        <Input id="imgPath" type="file" name="imgPath" onChange={handleImgChange} required />
                        <FormHelperText>Only JPEG, PNG, GIF, and WEBP files are allowed.</FormHelperText>
                        {updateFormData.imgPath && (
                            <div>
                                <p>
                                    {updateFormData.imgPath}
                                    <IconButton onClick={handleDeleteImg}>
                                        <DeleteIcon />
                                    </IconButton>
                                </p>
                            </div>
                        )}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => handleUpdateContribution(updateFormData)}
                        disabled={
                            !updateFormData.id ||
                            !updateFormData.title ||
                            !updateFormData.description ||
                            !updateFormData.filePath ||
                            !updateFormData.imgPath
                        }
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ViewRecent;
