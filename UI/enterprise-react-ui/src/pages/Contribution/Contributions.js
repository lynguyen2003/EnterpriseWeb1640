import React, { useState, useEffect } from 'react';
import { useGetClosureDateByIdQuery } from '~/feature/closureDates/dateApiSlice';
import { useGetAllMagazineQuery } from '~/feature/magazine/magazineApiSlice';
import { usePostMutation } from '~/feature/contribution/contributionApiSlice';
import { useGetUserByEmailQuery } from '~/feature/user/userApiSlice';

import './Contributions.css';

const Contribution = () => {
    const {
        data: closureDate,
        isLoading: closureDateLoading,
        error: closureDateError,
    } = useGetClosureDateByIdQuery(1);

    const {
        data: magazines,
        isLoading: magazinesLoading,
        error: magazinesError,
    } = useGetAllMagazineQuery();

    const currentEmail = localStorage.getItem('email');
    const {
        data: users,
        isLoading: usersLoading,
        error: usersError,
    } = useGetUserByEmailQuery(currentEmail);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    };
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        filePath: 'https://chat.openai.com/',
        closureDatesId: '',
        usersId: '',
        magazinesId: '',
    });

    useEffect(() => {
        if (!closureDateLoading && !closureDateError && closureDate) {
            setFormData((prevState) => ({
                ...prevState,
                closureDatesId: closureDate.id,
            }));
        }
    }, [closureDate, closureDateLoading, closureDateError]);

    useEffect(() => {
        if (!usersLoading && !usersError && users) {
            setFormData((prevState) => ({
                ...prevState,
                usersId: users.id,
            }));
        }
    }, [users, usersLoading, usersError]);

    const [post, { isLoading }] = usePostMutation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            filePath: file,
        });
    };

    const handleMagazineSelect = (e) => {
        const selectedMagazineId = e.target.value;
        setFormData({
            ...formData,
            magazinesId: selectedMagazineId,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('filePath', formData.filePath);
        formDataToSend.append('closureDatesId', formData.closureDatesId);
        formDataToSend.append('usersId', formData.usersId);
        formDataToSend.append('magazinesId', formData.magazinesId);

        try {
            // Call the API to submit the form data
            console.log(formData);
            await post(formData).unwrap();
            // Clear form data after successful submission
            setFormData({
                title: '',
                description: '',
                filePath: null,
                closureDatesId: '',
                usersId: 'b705c07e-5a72-4827-b405-3f5552fb2dbf',
                magazinesId: '',
            });
            // Optionally, you can add a success message or redirect the user
        } catch (error) {
            // Handle error
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="contributions">
            <div className="button row">
                <a className="btn col-sm" role="button" href="/contribution">
                    Upload articles
                </a>
                <a className="btn col-sm" role="button" href="/contribution">
                    View recent uploads
                </a>
            </div>
            <form onSubmit={handleSubmit}>
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
                    <input type="file" onChange={handleFileChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Upload Image:</label>
                    <input type="file" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Submission date :</label>
                    {/* Assuming you want to display the first closure date */}
                    {closureDateLoading ? (
                        <span>Loading...</span>
                    ) : closureDateError ? (
                        <span>Error loading submission data.</span>
                    ) : (
                        <span>{formatDate(closureDate.closureDate)}</span>
                    )}
                </div>
                <div className="mb-3">
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
                        value=""
                        id="flexCheckDefault"
                    />
                    <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                    >
                        I have read and agree to the terms and conditions
                    </label>
                </div>

                {isLoading ? (
                    <span>Loading...</span>
                ) : (
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                )}
            </form>
        </div>
    );
};

export default Contribution;
