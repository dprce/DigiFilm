import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    GlobalStyles,
    Icon,
    InputAdornment,
    IconButton
} from "@mui/material";
import { login } from "../../api/AuthApi.jsx"; // Assuming AuthApi.js contains login logic
import "./LoginPage.css";
import "./separator.css";
import {Visibility, VisibilityOff} from "@mui/icons-material";

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

    const isUsernameValid = () => {
        return username.endsWith("@fer.hr") || username.endsWith("@fer.unizg.hr");
    };

    const handleLogin = async () => {
        try {
            const response = await fetch("https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Authenticate/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            const data = await response.json();
    
            if (response.ok) {
                navigate(data.redirectUrl);
            } else {
                setError(data.message || "Login failed.");
            }
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

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
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
                            type={showPassword ? 'text' : 'password'} // Prikazivanje ili sakrivanje lozinke
                            name="password"
                            placeholder="Password"
                            label="Password"
                            className="password-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                backgroundColor: "#fafafa",
                                color: "#5d4037",
                                "&:hover": {
                                    backgroundColor: "#9e9e9e",
                                },
                            }}
                        >
                            Log In
                        </Button>
                        <div className="separator">OR</div>
                        {<Button
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
                        </Button>}
                    </form>
                </Paper>
            </Container>
        </div>
    );
};

export default LoginPage;
