import React from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import {Button} from "@mui/material";
import Navbar from '../../components/Navbar.jsx';
import "../../css/common.css"

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="app-container">
            <Navbar/> {/* Add the Navbar here */}
            <div style={{display: "flex", justifyContent: "center", margin:"80px 16px", alignItems: "center"}}>
                <h1 style={{ color: '#5d4037', textAlign: "center"}}>Welcome to DigiFilm!</h1>
            </div>
            <Footer/>
        </div>
    )
}

export default HomePage;