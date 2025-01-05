import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import LoginPage from "./pages/loginpage/LoginPage.jsx";
import HomePageAdmin from "./pages/homepage/HomePageAdmin.jsx";
import PostLoginRedirect from "./api/PostLoginRedirect.jsx";
import "./App.css";
import "./index.css";
import HomePage from "./pages/homepage/HomePage.jsx";

const App = () => {
    return (
        <NextUIProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/home" element={<HomePageAdmin />} />
                    <Route path="/post-login-redirect" element={<PostLoginRedirect />} />
                </Routes>
            </Router>
        </NextUIProvider>
    );
};

export default App;
