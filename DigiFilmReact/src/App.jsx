import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../src/pages/loginpage/LoginPage.jsx";
import HomePageAdmin from "../src/pages/homepage/HomePageAdmin.jsx";
import EditData from "../src/pages/editdatapage/EditData.jsx";
import ScanBarcode from "./pages/scanpage/ScanBarcode.jsx";
import FilmList from "./pages/filmlistpage/FilmList.jsx";
import SessionList from "./pages/sessionlistpage/SessionList.jsx";
import "./App.css";
import "./index.css";
import HomePage from "./pages/homepage/HomePage.jsx";

const App = () => {
  return (
    <Router>

        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePageAdmin />} />
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/editData" element={<EditData />} />
            <Route path="/scanBarcode" element={<ScanBarcode />} />
            <Route path="/filmList" element={<FilmList />} />
            <Route path="/sessionList" element={<SessionList />} />
            {/* Dodatne rute idu ovdje kad se rade novi ekrani */}
        </Routes>

    </Router>
  );
};

export default App;
