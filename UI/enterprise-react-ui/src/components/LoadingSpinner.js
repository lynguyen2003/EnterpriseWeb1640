// LoadingSpinner.js
import React from 'react';
import { BeatLoader } from 'react-spinners';

const LoadingSpinner = () => (
    <div className="loading-spinner">
        <BeatLoader color="#4A90E2" loading={true} size={20} />
    </div>
);

export default LoadingSpinner;
