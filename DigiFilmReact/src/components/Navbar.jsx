import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Box,Container,IconButton,Menu,MenuItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TheatersIcon from '@mui/icons-material/Theaters';
import {logout}  from "../api/AuthApi.jsx";
import { useNavigate } from 'react-router-dom';

export const fetchCurrentUser = async () => {
    try {
        const response = await fetch('https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Authenticate/claims', {
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

    const PAGES = role === "4"
        ? [
            { title: "Scan Barcode", href: "/scanBarcode" },
            { title: "Edit Data", href: "/editData" },
            { title: "Home", href: "/home" },
            { title: "Session list", href: "/sessionList" },
            { title: "Film list", href: "/filmList" },
            { title: "Add Employee", href: "/addEmployee" }, 
            {title: "View employee stats", href: "/employeeBatchData"}
        ]
        : [
            { title: "Scan Barcode", href: "/scanBarcode" },
            { title: "Edit Data", href: "/editData" },
            { title: "Home", href: "/home" },
            { title: "Session list", href: "/sessionList" },
            { title: "Film list", href: "/filmList" }
        ];
    console.log(role);

    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };


    return (
        <AppBar position="static" sx={{backgroundColor: '#bcaaa4'}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <TheatersIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                    <Typography
                        variant="h6"
                        noWrap
                        component="h6"
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        DigiFilm
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom', horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top', horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{display: {xs: 'block', md: 'none'}}}
                        >
                            {PAGES.map((page, index) => (
                                <MenuItem key={index}
                                          onClick={() => navigate(page.href)}>
                                <Typography sx={{textAlign: 'center'}}>{page.title}</Typography>
                            </MenuItem>))}
                        </Menu>
                    </Box>
                    <TheatersIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>
                    <Typography
                        variant="h6"
                        noWrap
                        component="h6"
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'none'},
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        DigiFilm
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {PAGES.map((page, index) => (<Button
                            key={index}
                            onClick={() => navigate(page.href)}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            {page.title}
                        </Button>))}
                    </Box>
                    <Box sx={{flexGrow: 0}}>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                backgroundColor: "#ffebee", color: "#5d4037", '&:hover': {
                                    backgroundColor: "#9e9e9e",
                                },
                            }}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>

       /* <AppBar position="static" sx={{ backgroundColor: '#bcaaa4' }}>
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
        </AppBar>*/
    );
};

export default Navbar;
