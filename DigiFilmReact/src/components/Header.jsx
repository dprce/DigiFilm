// Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/header.css';
import { logout } from 'src/Api/AuthApi.jsx';

const Header = () => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();

        (async () => {
            try {
                const response = await logout();
                if (response) {
                    navigate("/");  // Navigate to home or login page after successful logout
                } else {
                    console.error("Logout failed");
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        })();
    };

    return (
        <header>
            <h1>DigiFilm</h1>
            <button onClick={handleClick}>Logout</button>
        </header>
    );
};

export default Header;
