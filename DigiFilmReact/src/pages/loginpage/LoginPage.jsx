// src/pages/LoginPage.jsx
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {loginRequest} from "../../authConfig";
import {Container, Paper, Typography, TextField, Button, GlobalStyles, Icon} from "@mui/material";
import {login} from "../../api/AuthApi.jsx";
import "./LoginPage.css";
import "./separator.css";


const hexToRgba = (hex, alpha) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 7) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return hex;
};

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState(false);

    const isUsernameValid = () => {
        return username.endsWith("@fer.hr") || username.endsWith("@fer.unizg.hr");
    };

    {/*const handleLogin = async () => {
        try {
            // Directly redirect to the backend authentication URL to trigger the login flow
            window.location.href = "https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Authenticate/login";
        } catch (error) {
            console.error("Error initiating login:", error);
            setError("Something went wrong during login.");
        }
    };*/}

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError("Username and password are required.");
        } else if (!isUsernameValid()) {
            setError("You must use your fer account.");
        } else {
            setError("");
            // This can be an API call to authenticate using the username/password if needed
            // But in this case, we trigger the login with backend
            navigate("/homePage");
        }
    };

    const handleUsernameBlur = () => {
        setUsernameError(!isUsernameValid());
    };

    {/*const microsoftIcon = (
        <Icon sx={{
            height: "28px",
        }}>
            <img alt="microsoft-icon" src="/microsoft.svg"/>
        </Icon>
    );*/}

    return (
        <div className="login">
            <Container maxWidth="sm">
                <Paper elevation={3} className="paper" sx={{
                    borderRadius: '8px', backgroundColor: hexToRgba('#8d6e63', 0.4),
                }}>
                    <div className="login-title">
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: '48px',
                                color: '#5d4037',
                            }}
                        >
                            Welcome to DigiFilm
                        </Typography>

                        <Typography
                            variant="h2"
                            className="subtitle"
                            sx={{
                                fontSize: '24px',
                                color: '#f5f5f5',
                            }}
                        >
                            Log in to your account
                        </Typography>
                    </div>
                    <form className="login-form" onSubmit={handleSubmit}>

                        {error && <p className="error">{error}</p>}

                        <TextField
                            variant="outlined"
                            type="text"
                            name="username"
                            placeholder="Username"
                            label="Username"
                            value={username}
                            className="text-field"
                            onBlur={handleUsernameBlur}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            type="password"
                            name="password"
                            placeholder="Password"
                            label="Password"
                            className="password-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                backgroundColor: "#fafafa",
                                color: "#5d4037",
                                '&:hover': {
                                    backgroundColor: "#9e9e9e",
                                },
                            }}
                        >
                            Log In
                        </Button>
                        <div className="separator">OR</div>
                        {/*<Button
                            variant="contained"
                            startIcon={microsoftIcon}
                            sx={{
                                backgroundColor: "#fafafa",
                                color: "#5d4037",
                                '&:hover': {
                                    backgroundColor: "#9e9e9e",
                                },
                                textTransform: "none",
                            }}
                            onClick={handleLogin}
                        >
                            Sign in with Microsoft
                        </Button>*/}
                    </form>
                </Paper>
            </Container>
        </div>
    );
};

export default LoginPage;
