import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '~/feature/auth/authSlice';
import './Coordinator.css';

const Coordinator = () => {
    const token = useSelector(selectCurrentToken);
    const navigate = useNavigate();
    const [contributions, setContributions] = useState([]);

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const [contributionsResponse, usersResponse] = await Promise.all([
                    axios.get('http://localhost:7136/api/Contributions', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    axios.get('http://localhost:7136/api/Users', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    // axios.get('https://localhost:7136/api/Feedback', {
                    //     headers: {
                    //         Authorization: `Bearer ${token}`,
                    //     },
                    // }),
                ]);

                // Combine data from different responses
                const contributionsData = contributionsResponse.data;
                const usersData = usersResponse.data;

                const mappedContributions = contributionsData.map((contribution) => {
                    const user = usersData.find((user) => user.id === contribution.usersId);

                    // const feedback = feedbacksData.find(feedback => feedback.conId === contribution.id);
                    return {
                        ...contribution,
                        usersData: user || {}, // Default to empty object if user not found
                        // feedback: feedback || {} // Default to empty object if feedback not found
                    };
                });

                setContributions(mappedContributions);
            } catch (error) {
                console.error('Error fetching data:', error);
                setContributions([]);
            }
        };

        fetchContributions();
    }, [token]);

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

    const handleViewProvideFeedback = (contributionId) => {
        navigate(`/view-provide-feedback/${contributionId}`);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">View Contributions</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Stu-Name</th>
                        <th>Con-Title</th>
                        <th>Update-Date</th>
                        <th>Feedback</th>
                        <th>View Provide Feedback</th>
                    </tr>
                </thead>
                <tbody>
                    {contributions.map((contribution, index) => (
                        <tr key={contribution.id}>
                            <td>{index + 1}</td>
                            <td>{contribution.usersData.userName}</td>
                            <td>{contribution.title}</td>
                            <td>{formatDate(contribution.uploadDate)}</td>
                            <td>{contribution.feedback ? 'Responded' : 'Pending'}</td>
                            <td>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleViewProvideFeedback(contribution.id)}
                                >
                                    View/Provide Feedback
                                </button>
                            </td>
                        </tr>
                    ))}
                    {contributions.length === 0 && (
                        <tr>
                            <td colSpan="6">No contributions found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Coordinator;
