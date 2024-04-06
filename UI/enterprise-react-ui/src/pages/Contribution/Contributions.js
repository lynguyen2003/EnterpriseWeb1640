import React, { useState } from 'react';
import ViewRecent from './components/ViewRecentUpload/ViewRecentUpload';
import Upload from './components/Upload/Upload';
import './Contributions.css';

const Contribution = () => {
    const [showUpload, setShowUpload] = useState(true);
    const [showViewRecent, setShowViewRecent] = useState(false);

    const handleUploadClick = () => {
        setShowUpload(true);
        setShowViewRecent(false);
    };

    const handleViewRecentClick = () => {
        setShowUpload(false);
        setShowViewRecent(true);
    };
    const [selectedOption, setSelectedOption] = useState('upload');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="contributions">
            <div className="uvArticle">
                <div className="head">
                    <div className="cSwitch button row">
                        <button
                            className={`btn uploadArticle col-sm ${selectedOption === 'upload' ? 'bold' : ''}`}
                            onClick={() => {
                                handleOptionChange('upload');
                                handleUploadClick();
                            }}
                        >
                            Upload articles
                        </button>

                        <button
                            className={`btn viewRecent col-sm ${selectedOption === 'view' ? 'bold' : ''}`}
                            onClick={() => {
                                handleOptionChange('view');
                                handleViewRecentClick();
                            }}
                        >
                            View recent uploads
                        </button>
                    </div>
                </div>

                <div id="uploadArticlesContent" className="contents">
                    {showUpload && <Upload />}
                </div>

                <div id="viewUploadsContent" className="contents">
                    {showViewRecent && <ViewRecent />}
                </div>
            </div>
            {/* <div className="button row">
                <button className="btn col-sm" onClick={handleUploadClick}>
                    Upload articles
                </button>
                <button className="btn col-sm" onClick={handleViewRecentClick}>
                    View recent uploads
                </button>
            </div>
            {showUpload && <Upload />}
            {showViewRecent && <ViewRecent />} */}
        </div>
    );
};

export default Contribution;
