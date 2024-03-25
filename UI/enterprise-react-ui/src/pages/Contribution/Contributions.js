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

    return (
        <div className="contributions">
            <div className="button row">
                <button className="btn col-sm" onClick={handleUploadClick}>
                    Upload articles
                </button>
                <button className="btn col-sm" onClick={handleViewRecentClick}>
                    View recent uploads
                </button>
            </div>

            {showUpload && <Upload />}
            {showViewRecent && <ViewRecent />}
        </div>
    );
};

export default Contribution;
