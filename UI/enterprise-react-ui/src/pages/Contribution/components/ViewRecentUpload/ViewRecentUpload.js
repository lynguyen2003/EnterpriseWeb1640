import React, { useState, useEffect } from 'react';
import {
    useGetContributionByUserIdQuery,
    usePutContributionMutation,
    useDeleteContributionMutation,
} from '~/feature/contribution/contributionApiSlice';
import { useGetUserByEmailQuery } from '~/feature/user/userApiSlice';

const ViewRecent = () => {
    const currentEmail = localStorage.getItem('email');
    const { data: users } = useGetUserByEmailQuery(currentEmail);

    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedContributionId, setSelectedContributionId] = useState(null);
    const [update] = usePutContributionMutation();
    const [deleteContribution] = useDeleteContributionMutation();
    const [showFeedback, setShowFeedback] = useState({});

    const [formData, setFormData] = useState({
        id: null,
        title: '',
        description: '',
        filePath: 'https://chat.openai.com/',
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

    const userId = users?.id;
    const {
        data: contributions,
        isLoading: contributionsLoading,
        error: contributionsError,
        refetch: refetchContributions,
    } = useGetContributionByUserIdQuery(userId);

    useEffect(() => {
        if (successMessage || errorMessage) {
            const timeout = setTimeout(() => {
                setSuccessMessage(null);
                setErrorMessage(null);
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [successMessage, errorMessage]);

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

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        try {
            await update(formData).unwrap();
            setFormData({
                id: null,
                title: '',
                description: '',
                filePath: 'https://chat.openai.com/',
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
                                    <label className="form-label">Upload File:</label>
                                    <input type="file" />
                                </div>
                                <button type="submit">Submit Update</button>
                            </form>
                        )}

                        {showFeedback[contribution.id] && ( // Display feedback if toggled
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
                        {successMessage && <div className="success">{successMessage}</div>}
                        {errorMessage && <div className="error">{errorMessage}</div>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewRecent;
