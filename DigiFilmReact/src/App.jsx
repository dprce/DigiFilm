// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../src/pages/loginpage/LoginPage.jsx";
import HomePage from "../src/pages/homepage/HomePage.jsx";
import "./App.css";
import "./index.css";

const App = () => {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          {/* Dodatne rute idu ovdje kad se rade novi ekrani */}
        </Routes>
      
      </div>
    </Router>
  );
};

export default App;
