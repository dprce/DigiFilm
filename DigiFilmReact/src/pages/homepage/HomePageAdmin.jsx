import React from 'react';
import Header from "../../components/Header.jsx";
import AddEmployee from "../../components/AddEmployee.jsx";
import "./HomePageAdmin.css";

const HomePage = () => {

    return (
        <div className="homepage-admin">
            <Header />
            <AddEmployee />
        </div>
    )
}

export default HomePage;