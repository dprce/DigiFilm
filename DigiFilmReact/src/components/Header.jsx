// Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/header.css';
import {logout} from "../api/AuthApi.jsx";
import {Button, Typography} from "@mui/material";
import {brown} from "@mui/material/colors";



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
            <Typography
                variant="h1"
                sx={{
                    fontSize: '44px',
                    color: '#5d4037',
                }}
            >
            DigiFilm
            </Typography>
            <Button
                variant="contained"
                type="submit"
                sx={{
                    backgroundColor: "#bcaaa4",
                    color: "#5d4037",
                    '&:hover': {
                        backgroundColor: "#9e9e9e",
                    },
                }}
                onClick={handleClick}
            >
           Logout
            </Button>
        </header>
    );
};

export default Header;
