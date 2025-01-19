import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const fetchCurrentUser = async () => {
    const token = localStorage.getItem("authToken"); // Or wherever you're storing it
    if (!token) {
        console.error("Token is missing.");
        return;
    }

    console.log("Token:", token);

    try {
        const response = await fetch('https://localhost:7071/Authenticate/post-login', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            console.error("Unauthorized access. Token may be invalid or expired.");
            return;
        }

        const userData = await response.json();
        console.log("User Data:", userData);
        return userData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};

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
                        Batch list
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
