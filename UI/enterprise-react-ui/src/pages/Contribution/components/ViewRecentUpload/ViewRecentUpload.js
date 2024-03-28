import React, { useState, useEffect } from 'react';
import {
    useGetContributionByUserIdQuery,
    usePutContributionMutation,
    useDeleteContributionMutation,
} from '~/feature/contribution/contributionApiSlice';
import { useGetUserByEmailQuery } from '~/feature/user/userApiSlice';
import { fileDb } from '~/Config';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';

/* eslint-disable jsx-a11y/anchor-is-valid */
const ViewRecent = () => {
    const currentEmail = localStorage.getItem('email');
    const { data: users } = useGetUserByEmailQuery(currentEmail);
    const userId = users?.id;
    const [file, setFile] = useState(null);
    const [img, setImg] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedContributionId, setSelectedContributionId] = useState(null);
    const [update] = usePutContributionMutation();
    const [deleteContribution] = useDeleteContributionMutation();
    const [showFeedback, setShowFeedback] = useState({});
    const [isVisible, setIsVisible] = useState(true);

    const {
        data: contributions,
        isLoading: contributionsLoading,
        error: contributionsError,
        refetch: refetchContributions,
    } = useGetContributionByUserIdQuery(userId);

    const [formData, setFormData] = useState({
        id: null,
        title: '',
        description: '',
        filePath: '',
        imgPath: '',
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
            timeZone: 'UTC',
        };
        return date.toLocaleDateString('vi-VN', options);
    };

    useEffect(() => {
        if (successMessage || errorMessage) {
            const timeout = setTimeout(() => {
                setSuccessMessage(null);
                setErrorMessage(null);
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [successMessage, errorMessage]);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        setFormData({
            ...formData,
            filePath: file.name,
        });
    };

    const handleImgChange = (e) => {
        const img = e.target.files[0];
        setImg(img);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleContributionSelect = (e) => {
        const selectedContributionId = e.target.value;
        setFormData({
            ...formData,
            id: selectedContributionId,
        });
    };

    const handleUpdateClick = (contributionId) => {
        if (selectedContributionId === contributionId) {
            setIsUpdating(false);
            setSelectedContributionId(null);
        } else {
            setIsUpdating(true);
            setSelectedContributionId(contributionId);
        }
    };

    const handleFeedbackToggle = (contributionId) => {
        setShowFeedback((prevShowFeedback) => ({
            ...prevShowFeedback,
            [contributionId]: !prevShowFeedback[contributionId],
        }));
    };

    const handleDelete = async (contributionId) => {
        try {
            await deleteContribution(contributionId).unwrap();
            await refetchContributions();
        } catch (error) {
            console.error('Error deleting contribution:', error);
            setErrorMessage('An error occurred while deleting the contribution. Please try again later.');
        }
    };

    const handleDownloadFile = async (fileName) => {
        try {
            const fileRef = ref(fileDb, `files/${fileName}`);
            const downloadURL = await getDownloadURL(fileRef);
            window.open(downloadURL, '_blank');
        } catch (error) {
            console.error('Error download:', error);
            setErrorMessage('An error occurred while downloading. Please try again later.');
        }
    };

    const handleDownloadImg = async (imgName) => {
        try {
            const imageRef = ref(fileDb, `images/${imgName}`);
            const downloadURL = await getDownloadURL(imageRef);
            window.open(downloadURL, '_blank');
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred while downloading. Please try again later.');
        }
    };

    const handleDeleteFile = async (fileName) => {
        try {
            const fileRef = ref(fileDb, `files/${fileName}`);
            await deleteObject(fileRef);
        } catch (error) {
            console.error('Error delete:', error);
            setIsVisible(isVisible);
            setErrorMessage('An error occurred while deleting. Please try again later.');
        }
    };

    const handleDeleteImg = async (imgName) => {
        try {
            const imgRef = ref(fileDb, `images/${imgName}`);
            await deleteObject(imgRef);
        } catch (error) {
            console.error('Error delete:', error);
            setIsVisible(isVisible);
            setErrorMessage('An error occurred while deleting. Please try again later.');
        }
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        try {
            await update(formData).unwrap();

            const fileRef = ref(fileDb, `files/${file.name}`);
            uploadBytes(fileRef, file);

            const imgRef = ref(fileDb, `images/${img.name}`);
            uploadBytes(imgRef, img);
            setFormData({
                id: null,
                title: '',
                description: '',
                filePath: '',
                imgPath: '',
            });
            setSuccessMessage('Form submitted successfully!');
            await refetchContributions();
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage('An error occurred while submitting the form. Please try again later.');
        }
    };

    if (contributionsLoading) {
        return <p>Loading contributions...</p>;
    }
    if (contributionsError) {
        return <p>Error fetching contributions{contributionsError.message}</p>;
    }
    if (!contributions || contributions.length === 0) {
        return <p>No contributions found.</p>;
    }
    return (
        <div>
            <ul className="list-group">
                {contributions.map((contribution) => (
                    <li key={contribution.id} className="list-group-item">
                        <h3>{contribution.title}</h3>
                        <p>{contribution.description}</p>
                        <p>Upload Date: {formatDate(contribution.uploadDate)}</p>
                        <button
                            className="btn mr-2"
                            onClick={(e) => {
                                handleUpdateClick(contribution.id);
                                handleContributionSelect(e);
                            }}
                            value={contribution.id}
                        >
                            {selectedContributionId === contribution.id && isUpdating ? 'Update' : 'Update'}
                        </button>
                        <button className="btn" onClick={() => handleDelete(contribution.id)}>
                            Delete
                        </button>
                        <button className="btn" onClick={() => handleFeedbackToggle(contribution.id)}>
                            {showFeedback[contribution.id] ? 'Feedback' : 'Feedback'}
                        </button>

                        {isUpdating && selectedContributionId === contribution.id && (
                            <form onSubmit={handleSubmitUpdate}>
                                <div className="mb-3">
                                    <label className="form-label">Title:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description:</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    {isVisible && (
                                        <div className="mb-2">
                                            <a
                                                href="#"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    handleDownloadFile(contribution.filePath);
                                                }}
                                            >
                                                {contribution.filePath}
                                            </a>
                                            <a
                                                href="#"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    toggleVisibility();
                                                    handleDeleteFile(contribution.filePath);
                                                }}
                                            >
                                                <i className="fa-sharp fa-solid fa-circle-xmark"></i>
                                            </a>
                                        </div>
                                    )}
                                    <label className="form-label">Upload File:</label>
                                    <input type="file" onChange={handleFileChange} />
                                </div>
                                <div className="mb-3">
                                    {isVisible && (
                                        <div className="mb-2">
                                            <a
                                                href="#"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    handleDownloadImg(contribution.imgPath);
                                                }}
                                            >
                                                {contribution.imgPath}
                                            </a>
                                            <a
                                                href="#"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    toggleVisibility();
                                                    handleDeleteImg(contribution.imgPath);
                                                }}
                                            >
                                                <i className="fa-sharp fa-solid fa-circle-xmark"></i>
                                            </a>
                                        </div>
                                    )}
                                    <label className="form-label">Upload Image:</label>
                                    <input type="file" onChange={handleImgChange} />
                                </div>
                                <button type="submit">Submit Update</button>
                                {successMessage && <div className="success">{successMessage}</div>}
                                {errorMessage && <div className="error">{errorMessage}</div>}
                            </form>
                        )}

                        {showFeedback[contribution.id] && (
                            <div>
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title">Feedback</h5>
                                                <p className="card-text">This is the feedback message.</p>
                                                <hr />
                                                <h6 className="card-subtitle mb-2 text-muted">Comments</h6>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="d-flex flex-start">
                                                            <div className="flex-grow-1 flex-shrink-1">
                                                                <div>
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <p className="mb-1">
                                                                            <i className="fas fa-user-circle fa-2x ml-2 me-2"></i>
                                                                            <b>Maria Smantha </b>
                                                                            <span className="small">- 2 hours ago</span>
                                                                        </p>
                                                                        <a href="#!">
                                                                            <i className="fas fa-reply fa-xs"></i>
                                                                            <span className="small"> reply</span>
                                                                        </a>
                                                                    </div>
                                                                    <p className="small mb-0">
                                                                        It is a long established fact that a reader will
                                                                        be distracted by the readable content of a page.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="commenterName"
                                                    placeholder="Comment."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewRecent;
