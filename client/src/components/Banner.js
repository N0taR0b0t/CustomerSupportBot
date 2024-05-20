import React from 'react';
import './Banner.css';  // Assuming you create a CSS file for styling

const Banner = ({ message, success }) => {
    if (!message) return null;
    return (
        <div className={`banner ${success ? 'success' : 'fail'}`}>
            {message}
        </div>
    );
};

export default Banner;