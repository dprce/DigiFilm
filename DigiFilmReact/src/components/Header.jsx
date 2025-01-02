import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { logout } from "../api/AuthApi.jsx";

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
        <AppBar position="static" sx={{ backgroundColor: "#5d4037", color: "#fff" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                    DigiFilm
                </Typography>
                <Button
                    color="inherit"
                    onClick={handleLogout}
                    sx={{
                        textTransform: "none",
                        fontSize: "16px",
                    }}
                >
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
