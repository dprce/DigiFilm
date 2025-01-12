import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.jsx";
import AddEmployee from "../../components/AddEmployee.jsx";
import {jwtDecode} from "jwt-decode";
import "./HomePageAdmin.css";
import Footer from "../../components/Footer.jsx";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home">
            <Header/>
            <AddEmployee/>
            <Footer/>
        </div>
    );
};

export default HomePage;
