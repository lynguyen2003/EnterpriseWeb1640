import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetClosureDateByIdQuery } from '~/feature/closureDates/dateApiSlice';
import { useGetAllMagazineQuery } from '~/feature/magazine/magazineApiSlice';
import { usePostContributionMutation } from '~/feature/contribution/contributionApiSlice';
import { useGetUserByEmailQuery } from '~/feature/user/userApiSlice';
import { addContribution } from '~/feature/contribution/contributionSlice';

import { fileDb } from '~/Config';
import { ref, uploadBytes } from 'firebase/storage';

const Upload = () => {
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [file, setFile] = useState(null);
    const [img, setImg] = useState(null);
    const dispatch = useDispatch();
    const [post, { isLoading }] = usePostContributionMutation();

    const { data: closureDate, isLoading: closureDateLoading, error: closureDateError } = useGetClosureDateByIdQuery(1);
    const { data: magazines, isLoading: magazinesLoading, error: magazinesError } = useGetAllMagazineQuery();
    const currentEmail = localStorage.getItem('email');
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

    useEffect(() => {
        if (successMessage || errorMessage) {
            const timeout = setTimeout(() => {
                setSuccessMessage(null);
                setErrorMessage(null);
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [successMessage, errorMessage]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
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
        setFile(file);
        setFormData({
            ...formData,
            filePath: file.name,
        });
    };

    const handleImgChange = (e) => {
        const img = e.target.files[0];
        setImg(img);
        setFormData({
            ...formData,
            imgPath: img.name,
        });
    };

    const handleMagazineSelect = (e) => {
        const selectedMagazineId = e.target.value;
        setFormData({
            ...formData,
            magazinesId: selectedMagazineId,
        });
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        try {
            const contributionData = await post(formData).unwrap();
            dispatch(addContribution(contributionData));

            const fileRef = ref(fileDb, `files/${file.name}`);
            uploadBytes(fileRef, file);

            const imgRef = ref(fileDb, `images/${img.name}`);
            uploadBytes(imgRef, img);

            setFormData({
                title: '',
                description: '',
                filePath: '',
                imgPath: '',
                closureDatesId: '',
                usersId: '',
                magazinesId: '',
            });
            setSuccessMessage('Submitted successfully!');
        } catch (error) {
            if (error.status !== 'PARSING_ERROR') {
                console.error('Error:', error);
                setErrorMessage('An error occurred while submitting the form. Please try again later.');
            } else setSuccessMessage('Submitted successfully!');
        }
    };
    return (
        <form className="formArticle" onSubmit={handleSubmitUpdate}>
            <div className="mb-3 field">
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
            <div className="mb-3 fileUpload">
                <label className="form-label">Upload File:</label>
                <br />
                <input type="file" onChange={handleFileChange} />
            </div>
            <div className="mb-3 field">
                <label className="form-label">Description</label>
                <input
                    placeholder="Type your description here"
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mb-3 fileUpload">
                <label className="form-label">Upload Image:</label>
                <br />
                <input type="file" onChange={handleImgChange} />
            </div>
            <div className="mb-3">
                <label className="form-label">Submission date :</label>
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
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                    I have read and agree to the terms and conditions
                </label>
            </div>
            <div className="upload">
                {isLoading ? (
                    <span>Loading...</span>
                ) : (
                    <button type="submit" className="submit btn btn-primary">
                        Submit
                    </button>
                )}
            </div>
            {successMessage && <div className="success">{successMessage}</div>}
            {errorMessage && <div className="error">{errorMessage}</div>}
        </form>
        /* <form onSubmit={handleSubmitUpdate}>
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
                <input type="file" onChange={handleImgChange} />
            </div>
            <div className="mb-3">
                <label className="form-label">Submission date :</label>
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
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                <label className="form-check-label" htmlFor="flexCheckDefault">
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
            {successMessage && <div className="success">{successMessage}</div>}
            {errorMessage && <div className="error">{errorMessage}</div>}
        </form> */
    );
};

export default Upload;