import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Box,Container,IconButton,Menu,MenuItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TheatersIcon from '@mui/icons-material/Theaters';
import {logout}  from "../api/AuthApi.jsx";
import { useNavigate } from 'react-router-dom';

export const fetchCurrentUser = async () => {
    const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage 
};

const Navbar = () => {
    const navigate = useNavigate();
    let role = localStorage.getItem("role");

    useEffect(() => {
        const getUserData = async () => {
            const userData = await fetchCurrentUser();
            if (userData) {
                const roleClaim = userData.find((claim) => claim.type === 'RoleId');
                //setRole(roleClaim?.value || null);
            }
        };

        //getUserData();
    }, []);

    

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };


    return (
        <AppBar position="static" style={{ backgroundColor: "#5d4037" }}>
            <Toolbar>
                {/* App Title */}
                <Typography
                    variant="h6"
                    style={{ flexGrow: 1, cursor: "pointer" }}
                    onClick={() => navigate("/home")}
                >
                    DigiFilm
                </Typography>

                {/* Home Button (Visible to All Roles) */}
                <Button color="inherit" onClick={() => navigate("/home")}>
                    Home
                </Button>

                {role !== "1" && (
                    <Button color="inherit" onClick={() => navigate("/scanBarcode")}>
                        Add Employee
                    </Button>
                )}

                {/* Edit Data (Visible to Roles 4, 3, 2) */}
                {(role === "4" || role === "3" || role === "2") && (
                    <Button color="inherit" onClick={() => navigate("/editData")}>
                        Edit Data
                    </Button>
                )}

                {/* Film List (Visible to All Roles) */}
                <Button color="inherit" onClick={() => navigate("/filmList")}>
                    Film List
                </Button>

                {/* Session List (Visible to All Roles) */}
                <Button color="inherit" onClick={() => navigate("/sessionList")}>
                    Sessions
                </Button>

                {/* Add Employee (Visible to Role 4 Only) */}
                {role === "4" && (
                    <Button color="inherit" onClick={() => navigate("/addEmployee")}>
                        Add Employee
                    </Button>
                )}

                {/* Employee Stats (Visible to Role 4 Only) */}
                {role === "4" && (
                    <Button color="inherit" onClick={() => navigate("/employeeBatchData")}>
                        Employee Stats
                    </Button>
                )}

                {/* Logout Button (Visible to All Roles) */}
                <Button
                    color="inherit"
                    onClick={() => handleLogout()}
                >
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
