import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export async function fetchCurrentUser() {
    try {
        const response = await fetch(`https://localhost:7071/Authenticate/post-login`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            console.log("access token: " + data.accessToken);
            return data.accessToken;
        } else {
            console.error("Failed to fetch current user data. Status:", response.status);
            return [];
        }
    } catch (error) {
        console.error("Error fetching current user data:", error);
        return [];
    }
}

const token = await fetchCurrentUser();
let role = null;

console.log("Token: " + token);

if (token) {
   const decodedToken = jwtDecode(token);
   role = decodedToken.role;
   console.log(role);
}

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="static" sx={{ backgroundColor: '#bcaaa4' }}>
            <Toolbar>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/home')}
                        sx={{ color: '#5d4037' }}
                    >
                        Home
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/scanBarcode')}
                        sx={{ color: '#5d4037' }}
                    >
                        Scan Barcode
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/editData')}
                        sx={{ color: '#5d4037' }}
                    >
                        Edit Data
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/filmList')}
                        sx={{ color: '#5d4037' }}
                    >
                        Film list
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/sessionList')}
                        sx={{ color: '#5d4037' }}
                    >
                        Session list
                    </Button>
                    {(role === "4") && <Button
                        color="inherit"
                        onClick={() => navigate('/addEmployee')}
                        sx={{ color: '#5d4037' }}
                    >
                        Add Employee
                    </Button>}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
