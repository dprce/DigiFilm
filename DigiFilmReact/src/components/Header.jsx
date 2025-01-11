import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { logout } from "../api/AuthApi.jsx";
// Header.js
import '../css/header.css';
import {brown} from "@mui/material/colors";



const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
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
                onClick={handleLogout}
            >
           Logout
            </Button>
        </header>
    );
};

export default Header;
