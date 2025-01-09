import React from 'react';
import Header from "../../components/Header.jsx";
import AddEmployee from "../../components/AddEmployee.jsx";
import "./HomePageAdmin.css";
import Footer from "../../components/Footer.jsx";

const HomePage = () => {

    return (
        <div className="home">
            <Header/>
            <AddEmployee/>
            <Footer/>
        </div>
    )
}

export default HomePage;