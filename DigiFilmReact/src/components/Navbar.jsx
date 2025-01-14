import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="static" sx={{ backgroundColor: '#bcaaa4' }}>
            <Toolbar>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
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
                        onClick={() => navigate('/home')}
                        sx={{ color: '#5d4037' }}
                    >
                        Home
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/filmList')}
                        sx={{ color: '#5d4037' }}
                    >
                        Session list
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/sessionList')}
                        sx={{ color: '#5d4037' }}
                    >
                        Film list
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
