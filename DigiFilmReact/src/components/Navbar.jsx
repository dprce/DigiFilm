import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const fetchCurrentUser = async () => {
    try {
        const response = await fetch('https://localhost:7071/Authenticate/claims', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (response.status === 401) {
            console.error("Unauthorized access. Token may be invalid or expired.");
            return null;
        }

        const userData = await response.json();
        console.log("User Data:", userData);
        return userData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};

const Navbar = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            const userData = await fetchCurrentUser();
            if (userData) {
                const roleClaim = userData.find((claim) => claim.type === 'RoleId');
                setRole(roleClaim?.value || null);
            }
        };

        getUserData();
    }, []);

    return (
        <AppBar position="static" sx={{ backgroundColor: '#bcaaa4' }}>
            <Toolbar>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" onClick={() => navigate('/home')} sx={{ color: '#5d4037' }}>
                        Home
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/scanBarcode')} sx={{ color: '#5d4037' }}>
                        Scan Barcode
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/editData')} sx={{ color: '#5d4037' }}>
                        Edit Data
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/filmList')} sx={{ color: '#5d4037' }}>
                        Film list
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/sessionList')} sx={{ color: '#5d4037' }}>
                        Batch list
                    </Button>
                    {role === "4" && (
                        <Button color="inherit" onClick={() => navigate('/addEmployee')} sx={{ color: '#5d4037' }}>
                            Add Employee
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
