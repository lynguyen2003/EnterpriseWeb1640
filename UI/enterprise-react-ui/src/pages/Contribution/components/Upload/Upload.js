import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { fileDb } from '~/Config';
import { ref, uploadBytes } from 'firebase/storage';
import { selectCurrentEmail } from '~/feature/auth/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import LoadingSpinner from '~/components/LoadingSpinner';

import { useGetAllClosureDatesQuery } from '~/feature/closureDates/dateApiSlice';
import { useGetAllMagazineQuery } from '~/feature/magazine/magazineApiSlice';
import { usePostContributionMutation } from '~/feature/contribution/contributionApiSlice';
import { useGetUserByEmailQuery } from '~/feature/user/userApiSlice';
import { addContribution } from '~/feature/contribution/contributionSlice';
import { useSendEmailRequestMutation } from '~/feature/email/emailApiSlice';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [img, setImg] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [showCheckboxError, setShowCheckboxError] = useState(false);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
    const [selectedClosureDate, setSelectedClosureDate] = useState(null);
    const [isExpired, setIsExpired] = useState(false);
    const dispatch = useDispatch();
    const [post, { isLoading }] = usePostContributionMutation();
    const [sendEmailRequest] = useSendEmailRequestMutation();

    const { data: closureDatesObject } = useGetAllClosureDatesQuery();
    const { data: magazines, isLoading: magazinesLoading, isError: magazinesError } = useGetAllMagazineQuery();
    const currentEmail = useSelector(selectCurrentEmail);
    const { data: users, isLoading: usersLoading, error: usersError } = useGetUserByEmailQuery(currentEmail);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        filePath: '',
        imgPath: '',
        closureDatesId: '',
        usersId: '',
        magazinesId: '',
    });

    console.log(formData);

    useEffect(() => {
        if (!usersLoading && !usersError && users) {
            setFormData((prevState) => ({
                ...prevState,
                usersId: users[0].id,
            }));
        }
    }, [users, usersLoading, usersError]);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
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
            setFormData({
                ...formData,
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
            setFormData({
                ...formData,
                imgPath: img.name,
            });
        }
    };

    const handleDeleteFile = () => {
        setFormData((prevState) => ({
            ...prevState,
            filePath: '',
        }));
    };

    const handleDeleteImg = () => {
        setFormData((prevState) => ({
            ...prevState,
            imgPath: '',
        }));
    };

    const handleMagazineSelect = (e) => {
        const selectedMagazineId = e.target.value;
        setFormData({
            ...formData,
            magazinesId: selectedMagazineId,
        });
    };

    const handleAcademicYearChange = (e) => {
        const selectedAcademicYear = e.target.value;
        setSelectedAcademicYear(selectedAcademicYear);

        const selectedClosureDate = closureDatesObject.find((date) => date.academicYear === selectedAcademicYear);
        if (selectedClosureDate) {
            const currentDate = new Date();
            const closureDate = new Date(selectedClosureDate.closureDate);
            if (closureDate < currentDate) {
                setIsExpired(true);
            } else {
                setIsExpired(false);
            }

            setFormData((prevState) => ({
                ...prevState,
                closureDatesId: selectedClosureDate.id,
            }));
            setSelectedClosureDate(closureDate);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isChecked) {
            setShowCheckboxError(true);
            return;
        }

        if (isExpired) {
            toast.error('The submission date for the selected academic year has expired.');
            return;
        }

        try {
            const contributionData = await post(formData).unwrap();
            dispatch(addContribution(contributionData));

            sendEmailRequest(users[0].facultiesId);

            const fileRef = ref(fileDb, `files/${file.name}`);
            uploadBytes(fileRef, file);

            const imgRef = ref(fileDb, `images/${img.name}`);
            uploadBytes(imgRef, img);

            setFormData({
                ...formData,
                title: '',
                description: '',
                filePath: '',
                imgPath: '',
                magazinesId: '',
            });
            toast.success('Submitted successfully!');
        } catch (error) {
            if (error.status !== 'PARSING_ERROR') {
                console.error('Error:', error);
                toast.error('Failed to submit user');
            } else toast.success('Submitted successfully!');
        }
    };

    return (
        <form className="formArticle" onSubmit={handleSubmit}>
            <div className=" field">
                <label className="form-label">Title</label>
                <input
                    placeholder="Type your title here"
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                />
            </div>

            <div className=" fileUpload">
                <label className="form-label">Upload File: </label>
                <p className="form-text text-muted">Only Word documents and PDF files are allowed.</p>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    size="large"
                    sx={{ backgroundColor: '#3288c5' }}
                >
                    Upload file
                    <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                </Button>
                {formData.filePath && (
                    <div>
                        <p>
                            {formData.filePath}
                            <IconButton onClick={handleDeleteFile}>
                                <DeleteIcon />
                            </IconButton>
                        </p>
                    </div>
                )}
            </div>
            <div className=" field">
                <label className="form-label">Description</label>
                <input
                    placeholder="Type your description here"
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
            </div>
            <div className=" fileUpload">
                <label className="form-label">Upload Image: </label>
                <p className="form-text text-muted">Only JPEG, PNG, GIF, and WEBP files are allowed.</p>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    size="large"
                    sx={{ backgroundColor: '#3288c5' }}
                >
                    Upload Image
                    <VisuallyHiddenInput type="file" onChange={handleImgChange} />
                </Button>

                {formData.imgPath && (
                    <Box>
                        <p>
                            {formData.imgPath}
                            <IconButton onClick={handleDeleteImg}>
                                <DeleteIcon />
                            </IconButton>
                        </p>
                    </Box>
                )}
            </div>
            <div>
                <Box display="flex" justifyContent="space-between">
                    <Box>
                        <label className="form-label">Submission date :</label>
                        {selectedClosureDate ? <span> {formatDate(selectedClosureDate)}</span> : <span> ...</span>}
                        {isExpired && <p className="text-danger">The submission date has expired.</p>}
                    </Box>
                    <Box>
                        <select
                            className="form-select"
                            value={selectedAcademicYear}
                            onChange={handleAcademicYearChange}
                        >
                            <option defaultValue>Select Academic Year</option>
                            {(closureDatesObject || []).map((date) => (
                                <option key={date.id} value={date.academicYear}>
                                    {date.academicYear}
                                </option>
                            ))}
                        </select>
                    </Box>
                </Box>
            </div>
            <div>
                <select
                    className="form-select"
                    aria-label="Default select example"
                    value={formData.magazinesId}
                    onChange={handleMagazineSelect}
                >
                    <option defaultValue>Select magazine</option>
                    {magazinesLoading ? (
                        <option>Loading...</option>
                    ) : magazinesError ? (
                        <option>Error loading magazines.</option>
                    ) : (
                        magazines.map((magazine) => (
                            <option key={magazine.id} value={magazine.id}>
                                {magazine.title}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    value={isChecked}
                    onChange={(e) => {
                        setIsChecked(e.target.checked);
                        setShowCheckboxError(!e.target.checked);
                    }}
                    id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                    I have read and agree to the terms and conditions
                </label>
                {showCheckboxError && (
                    <p className="text-danger">You must agree to the terms and conditions before submitting.</p>
                )}
            </div>
            <div className="upload">
                <button type="submit" className="submit btn btn-primary">
                    {isLoading ? <LoadingSpinner /> : 'Submit'}
                </button>
                <ToastContainer />
            </div>
        </form>
    );
};

export default Upload;
