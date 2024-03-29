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
    const [selectedOption, setSelectedOption] = useState('upload'); // Sử dụng useState để lưu trữ trạng thái của lựa chọn

    return (
        <div className="contributions">
            <div className="uvArticle">
                <div className="head">
                    <div className="cSwitch button row">
                        <button
                            className={`btn uploadArticle col-sm ${selectedOption === 'upload' ? 'bold' : ''}`}
                            onClick={handleUploadClick}
                        >
                            Upload articles
                        </button>

                        <button
                            className={`btn uploadImg col-sm ${selectedOption === 'view' ? 'bold' : ''}`}
                            onClick={handleViewRecentClick}
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
