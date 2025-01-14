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
            <Navbar /> {/* Add the Navbar here */}
            <Header/>
            <div className="list_buttons">
            <Button  sx={{
                backgroundColor: "#fafafa",
                color: "#212121",
                '&:hover': {
                    backgroundColor: "#9e9e9e",
                },
            }}
                     onClick={() => navigate("/scanBarcode")}>
                Scan barcode
            </Button>
            <Button  sx={{
                backgroundColor: "#fafafa",
                color: "#212121",
                '&:hover': {
                    backgroundColor: "#9e9e9e",
                },
            }}
                     onClick={() => navigate("/filmList")}>
                Film List
            </Button>
            <Button  sx={{
                backgroundColor: "#fafafa",
                color: "#212121",
                '&:hover': {
                    backgroundColor: "#9e9e9e",
                },
            }}
                     onClick={() => navigate("/sessionList")}>
                Session List
            </Button>
            </div>
            <Footer />
        </div>
    )
}

export default HomePage;