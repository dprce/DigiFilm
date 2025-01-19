import React from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import {Button} from "@mui/material";
import Navbar from '../../components/Navbar.jsx';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage">
            <Navbar/> {/* Add the Navbar here */}
            <Header/>
            <div style={{display: "flex", justifyContent: "center", height: "100vh", alignItems: "center"}}>
                <h1 style={{fontSize: '100px', color: '#5d4037', margin: '32px', textAlign: "center"}}>Welcome to DigiFilm!</h1>
            </div>
            <Footer/>
        </div>
    )
}

export default HomePage;