import React, { useState } from 'react';
import { useGetClosureDateByIdQuery } from '~/feature/closureDates/dateApiSlice';
import { useGetAllMagazineQuery } from '~/feature/magazine/magazineApiSlice';
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    };

    const [selectedOption, setSelectedOption] = useState('upload'); // Sử dụng useState để lưu trữ trạng thái của lựa chọn

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="contributions">
            <div className="uvArticle">
                <div className='head'>
                    <div className="cSwitch button row">
                        <button
                            className={`btn uploadArticle col-sm ${
                                selectedOption === 'upload' ? 'bold' : ''
                            }`}
                            onClick={() => handleOptionChange('upload')}
                        >
                            Upload articles
                        </button>

                        <button
                            className={`btn uploadImg col-sm ${
                                selectedOption === 'view' ? 'bold' : ''
                            }`}
                            onClick={() => handleOptionChange('view')}
                        >
                            View recent uploads
                        </button>
                    </div>
                </div>

                <div
                    id="uploadArticlesContent"
                    className="contents"
                    style={{
                        display: selectedOption === 'upload' ? 'block' : 'none',
                    }}
                >
                    <form className="formArticle">
                        <div className="mb-3 field">
                            <label className="form-label">Title</label>
                            <input
                                placeholder="Type your title here"
                                type="text"
                                className="form-control"
                                name="title"
                            />
                        </div>
                        <div className="mb-3 fileUpload">
                            <label className="form-label">Upload File:</label>
                            <br />
                            <input type="file" />
                        </div>
                        <div className="mb-3 field">
                            <label className="form-label">Description</label>
                            <input
                                placeholder="Type your description here"
                                className="form-control"
                                name="description"
                            />
                        </div>
                        <div className="mb-3 fileUpload">
                            <label className="form-label">Upload Image:</label>
                            <br />
                            <input type="file" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Submission date :
                            </label>
                            {/* Assuming you want to display the first closure date */}
                            {closureDateLoading ? (
                                <span>Loading...</span>
                            ) : closureDateError ? (
                                <span>Error loading submission data.</span>
                            ) : (
                                <span>
                                    {formatDate(closureDate.closureDate)}
                                </span>
                            )}
                        </div>
                        <div className="mb-3">
                            <select
                                className="form-select"
                                aria-label="Default select example"
                            >
                                <option defaultValue>Select magazine</option>
                                {magazinesLoading ? (
                                    <option>Loading...</option>
                                ) : magazinesError ? (
                                    <option>Error loading magazines.</option>
                                ) : (
                                    magazines.map((magazine) => (
                                        <option
                                            key={magazine.id}
                                            value={magazine.id}
                                        >
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
                                I have read and agree to the terms and
                                conditions
                            </label>
                        </div>
                    </form>
                    <div className="upload">
                        <button
                            type="submit"
                            className="submit btn btn-primary"
                        >
                            Submit
                        </button>
                    </div>
                </div>

                <div
                    id="viewUploadsContent"
                    className="contents"
                    style={{
                        display: selectedOption === 'view' ? 'block' : 'none',
                    }}
                ></div>
            </div>
        </div>
    );
};

export default Contribution;
