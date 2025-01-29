import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Icon,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./LoginPage.css";
import "./separator.css";

const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Extract tokens from query parameters after redirect
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");
        const refreshToken = urlParams.get("refreshToken");
        const redirectUrl = urlParams.get("redirectUrl");

        if (accessToken && refreshToken) {
            // Save tokens to localStorage
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            // Navigate to the home page or provided redirect URL
            navigate(redirectUrl || "/home");
        }
    }, [navigate]);

    const isUsernameValid = () => {
        return username.endsWith("@fer.hr") || username.endsWith("@fer.unizg.hr");
    };

    const handleLogin = async () => {
        try {
            // Trigger the backend login process
            window.location.href =
                "https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Authenticate/login";
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred during login.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError("Username and password are required.");
        } else if (!isUsernameValid()) {
            setError("You must use your FER account.");
        } else {
            setError("");
            try {
                const response = await login({ username, password });
                if (response.success) {
                    navigate("/home");
                } else {
                    setError(response.message || "Login failed.");
                }
            } catch (error) {
                console.error("Error during login:", error);
                setError("An error occurred during login.");
            }
        }
    };

    const handleUsernameBlur = () => {
        if (!isUsernameValid() && username) {
            setError("Invalid email domain. Use your FER account.");
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const microsoftIcon = (
        <Icon sx={{ height: "28px" }}>
            <img alt="microsoft-icon" src="/microsoft.svg" />
        </Icon>
    );

    return (
        <div className="login">
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    className="paper"
                    sx={{
                        borderRadius: "8px",
                        backgroundColor: hexToRgba("#8d6e63", 0.4),
                    }}
                >
                    <div className="login-title">
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: "48px",
                                color: "#5d4037",
                            }}
                        >
                            Welcome to DigiFilm
                        </Typography>

                        <Typography
                            variant="h2"
                            className="subtitle"
                            sx={{
                                fontSize: "24px",
                                color: "#f5f5f5",
                            }}
                        >
                            Log in to your account
                        </Typography>
                    </div>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <Button
                            variant="contained"
                            startIcon={microsoftIcon}
                            sx={{
                                backgroundColor: "#fafafa",
                                color: "#5d4037",
                                "&:hover": {
                                    backgroundColor: "#9e9e9e",
                                },
                                textTransform: "none",
                            }}
                            onClick={handleLogin}
                        >
                            Sign in with Microsoft
                        </Button>
                    </form>
                </Paper>
            </Container>
        </div>
    );
};

export default LoginPage;
