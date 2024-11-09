import { useState } from "react";
import './App.css';
//import React from 'react';
import {Container, GlobalStyles, Paper, Typography, TextField,Button} from '@mui/material';
import {brown, red} from '@mui/material/colors';
import { grey } from '@mui/material/colors';

const color1 = brown["700"];
const color2=grey["50"]
const color3=grey["500"]


const hexToRgba = (hex, alpha) => {
    // Izvlačenje R, G, B vrijednosti iz hex formata
    let r = 0, g = 0, b = 0;
    // Ako hex boja počinje s #
    if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`; // Vraćanje u rgba format
};
const App = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState(false); // Novo stanje za grešku u korisničkom imenu

    const isUsernameValid = () => {
        return username.includes("@fer.hr") || username.includes("@fer.unizg.hr");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError("Polja Korisnik i Lozinka moraju biti ispunjeni.");
        } else if (
            !username.includes("@fer.hr") &&
            !username.includes("@fer.unizg.hr")
        ) {
            setError("Morate se prijaviti FER računom.");
        } else {
            setError("");
            alert("Uspješno ste se prijavili, podatci poslani serveru.");
        }
    };

    const handleUsernameBlur = () => {
        // Postavlja `usernameError` na `true` ako `username` nije validan
        setUsernameError(!isUsernameValid());
    };

    return (
        <>
            <GlobalStyles
                styles={{
                    body:{
                        backgroundImage:'url(/public/film.jpg)',
                        backgroundSize:'cover',
                        backgroundPosition:'center',
                        backgroundRepeat:'no-repeat',
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
                               justifyContent: 'center', // Horizontally center
                               alignItems: 'center', // Vertically center
                               minHeight: '100vh', // Full height of the viewport
                               width:'90%',
                               height:'100%',
                           }}>
                    <Paper  elevation={3} style={{padding:'50px', borderRadius:'8px',backgroundColor: hexToRgba('#8d6e63',0.4), // Bijela boja sa 80% neprozirnosti
                        backdropFilter: 'blur(10px)',}}>
                        <form className="login" onSubmit={handleSubmit}>
                            <Typography
                                variant="h1"
                                sx={{
                                    color:color1,
                                    fontSize:'2rem',
                                }}
                            >
                                Welcome to DigiFilm
                            </Typography>

                            <Typography
                                variant="h2"
                                sx={{
                                    color:color2,
                                    fontSize:'1.3rem',
                                    paddingTop:'1rem',
                                }}
                            >
                                Log In
                            </Typography>

                            {error && <p className="error">{error}</p>}

                            <div>
                                <TextField
                                    variant="outlined"
                                    className="tekst"
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    label="Username"
                                    value={username}
                                    onBlur={handleUsernameBlur}

                                    sx={{marginTop:'25px', marginBottom:'5px',
                                        height: '55px',           // Fiksna visina
                                        '& .MuiInputBase-root': {  // Stiliziranje unutarnjeg dijela TextField-a
                                            height: '100%', // Unutarnja visina usklađena s vanjskom visinom

                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: usernameError ? red[500] : 'white', // Postavlja bijeli obrub na fokusu
                                            },
                                            '& fieldset': {
                                                borderColor: usernameError ? red[500] : 'white' // Granica kad polje nije u fokusu
                                            },
                                        },

                                        '& .MuiInputLabel-root': {
                                            color: 'white', // Opcionalno, postavlja boju oznake na bijelo
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { // Stiliziranje boje oznake u fokusu
                                            color: 'white',
                                        },}}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <TextField
                                    variant="outlined"
                                    className="tekst"
                                    type="password"
                                    name="password"
                                    placeholder="Passsword"
                                    label="Password"
                                    value={password}
                                    sx={{ marginBottom:'15px',
                                        height: '55px',           // Fiksna visina
                                        '& .MuiInputBase-root': {  // Stiliziranje unutarnjeg dijela TextField-a
                                            height: '100%',          // Unutarnja visina usklađena s vanjskom visinom
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: (!password) ? red[500] : 'white', // Postavlja bijeli obrub na fokusu
                                            },
                                            '& fieldset': {
                                                borderColor:  'white' // Granica kad polje nije u fokusu
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'white', // Opcionalno, postavlja boju oznake na bijelo
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { // Stiliziranje boje oznake u fokusu
                                            color: 'white',
                                        },
                                    }}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button
                                variant="contained"
                                type="submit"
                                className="submit"
                                sx={{
                                    backgroundColor: color2, // Prilagođena boja pozadine
                                    color: color1,           // Boja teksta
                                    '&:hover': {
                                        backgroundColor: color3, // Prilagođena boja pozadine pri hover-u
                                    },
                                }}
                            >Log In
                            </Button>

                        </form>
                    </Paper>
                </Container>
            </div>
        </>
    );
};

export default App;
