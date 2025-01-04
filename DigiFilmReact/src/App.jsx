// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../src/pages/loginpage/LoginPage.jsx";
import HomePage from "../src/pages/homepage/HomePage.jsx";
import HomePageAdmin from "../src/pages/homepage/HomePageAdmin.jsx";
import EditData from "../src/pages/editDataPage/EditData.jsx";
import "./App.css";
import "./index.css";
import HomePageRead from "./pages/homepage/HomePageRead.jsx";

const App = () => {
  return (
    <Router>

        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePageAdmin />} />
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/homePageRead" element={<HomePageRead />} />
            <Route path="/editData" element={<EditData />} />
            {/* Dodatne rute idu ovdje kad se rade novi ekrani */}
        </Routes>

    </Router>
  );
};

export default App;
