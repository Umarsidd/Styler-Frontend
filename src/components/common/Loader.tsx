import React from 'react';
import { FaCut } from 'react-icons/fa';
import './Loader.css';

const Loader: React.FC = () => {
    return (
        <div className="loader-container">
            <FaCut className="loader-icon" />
        </div>
    );
};

export default Loader;
