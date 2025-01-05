import React from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import {Button} from "@mui/material";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage">
            <Header/>
            <Button onClick={() => navigate("/scanBarcode")}>Scan barcode</Button>
            <Button onClick={() => navigate("/filmList")}>Film List</Button>
            <Button onClick={() => navigate("/sessionList")}>Session List</Button>
            <Footer />
        </div>
    )
}

export default HomePage;