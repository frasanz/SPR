// src/coomponents/GoogleLoginButton.js:

import React from 'react';

const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        // Redirect the user to the Django Backend for login
        const backendLoginUrl = 'https://speech-record.com:543/accounts/google/login/';
        window.location.href = backendLoginUrl;
    };

    return (
        <button onClick={handleGoogleLogin}>Login with Google</button>
    );
};

export default GoogleLoginButton;
