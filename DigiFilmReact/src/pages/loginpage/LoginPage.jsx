// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../authConfig";
import { Container, Paper, Typography, TextField, Button, GlobalStyles } from "@mui/material";
import { brown, red, grey } from "@mui/material/colors";
import { login } from "../../api/AuthApi.jsx";

const color1 = brown["700"];
const color2 = grey["50"];
const color3 = grey["500"];

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

    const handleLogin = async () => {
        try {
            // Directly redirect to the backend authentication URL to trigger the login flow
            window.location.href = "https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Authenticate/login";
        } catch (error) {
            console.error("Error initiating login:", error);
            setError("Something went wrong during login.");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError("Polja Korisnik i Lozinka moraju biti ispunjeni.");
        } else if (!isUsernameValid()) {
            setError("Morate se prijaviti s FER računom.");
        } else {
            setError("");
            // This can be an API call to authenticate using the username/password if needed
            // But in this case, we trigger the login with backend
            handleLogin();
        }
    };

    const handleUsernameBlur = () => {
        setUsernameError(!isUsernameValid());
    };

    return (
        <>
            <GlobalStyles
                styles={{
                    body: {
                        backgroundImage: 'url(/film.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: '100vh',
                        margin: 0,
                        padding: 0,
                        overflow: 'hidden',
                    },
                }}
            />
            <div className="app">
                <Container maxWidth="sm"
                           sx={{
                               display: 'flex',
                               justifyContent: 'center',
                               alignItems: 'center',
                               minHeight: '100vh',
                               width: '90%',
                               height: '100%',
                           }}>
                    <Paper elevation={3} style={{
                        padding: '50px', borderRadius: '8px', backgroundColor: hexToRgba('#8d6e63', 0.4),
                        backdropFilter: 'blur(10px)',
                    }}>
                        <form className="login" onSubmit={handleSubmit}>
                            <Typography
                                variant="h1"
                                sx={{
                                    color: color1,
                                    fontSize: '2rem',
                                }}
                            >
                                Welcome to DigiFilm
                            </Typography>

                            <Typography
                                variant="h2"
                                sx={{
                                    color: color2,
                                    fontSize: '1.3rem',
                                    paddingTop: '1rem',
                                }}
                            >
                                Log In
                            </Typography>

                            {error && <p className="error">{error}</p>}

                            <div>
                                <TextField
                                    variant="outlined"
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    label="Username"
                                    value={username}
                                    onBlur={handleUsernameBlur}
                                    sx={{
                                        marginTop: '25px', marginBottom: '5px',
                                        height: '55px',
                                    }}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <TextField
                                    variant="outlined"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    label="Password"
                                    value={password}
                                    sx={{
                                        marginBottom: '15px',
                                        height: '55px',
                                    }}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                    backgroundColor: color2,
                                    color: color1,
                                    '&:hover': {
                                        backgroundColor: color3,
                                    },
                                }}
                            >
                                Log In
                            </Button>
                            <Button
                                onClick={handleLogin}
                            >
                                <img src="/signin.png" alt="Sign In" />
                            </Button>
                        </form>
                    </Paper>
                </Container>
            </div>
        </>
    );
};

export default LoginPage;
