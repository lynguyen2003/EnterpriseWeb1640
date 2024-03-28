
import React, { useState } from 'react';
import './Contributions.css';

const Contribution = () => {
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
                        </div>
                        <div className="mb-3">
                            <select
                                className="form-select"
                                aria-label="Default select example"
                            >
                                <option defaultValue>Select magazine</option>
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
