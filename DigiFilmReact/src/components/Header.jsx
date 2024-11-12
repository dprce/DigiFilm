import React from 'react';
import {useNavigate} from 'react-router-dom';
import '../css/header.css'

const Header = () => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();
        navigate("/");
    }

    return (
        <header>
            <h1>DigiFilm</h1>
            <button onClick={handleClick}>Logout</button>
        </header>
    )
}

export default Header;