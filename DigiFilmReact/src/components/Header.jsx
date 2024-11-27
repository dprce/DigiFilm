// Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/header.css';
import {logout} from "../api/AuthApi.jsx";


const Header = () => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();

        (async () => {
            try {
                navigate("/");
                await logout();
                
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
