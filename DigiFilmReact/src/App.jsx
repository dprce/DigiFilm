import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../src/pages/loginpage/LoginPage.jsx";
import HomePage from "./pages/homepage/HomePage.jsx";
import EditData from "../src/pages/editdatapage/EditData.jsx";
import ScanBarcode from "./pages/scanpage/ScanBarcode.jsx";
import FilmList from "./pages/filmlistpage/FilmList.jsx";
import SessionList from "./pages/sessionlistpage/SessionList.jsx";
import AddEmployee from "./pages/addemployeepage/AddEmployee.jsx";
import "./App.css";
import "./index.css";


const App = () => {
  return (
    <Router>

        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/editData" element={<EditData />} />
            <Route path="/scanBarcode" element={<ScanBarcode />} />
            <Route path="/filmList" element={<FilmList />} />
            <Route path="/sessionList" element={<SessionList />} />
            <Route path="/addEmployee" element={<AddEmployee />} />
            {/* Dodatne rute idu ovdje kad se rade novi ekrani */}
        </Routes>

    </Router>
  );
};

export default App;
