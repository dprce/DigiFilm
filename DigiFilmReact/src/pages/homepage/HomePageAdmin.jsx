import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.jsx";
import AddEmployee from "../../components/AddEmployee.jsx";
import {jwtDecode} from "jwt-decode";
import "./HomePageAdmin.css";
import Footer from "../../components/Footer.jsx";

const HomePage = () => {
    const navigate = useNavigate();

    const handlePostLogin = async () => {
        console.log("handlePostLogin triggered");
        localStorage.removeItem("accessToken");
        try {
            const response = await fetch("https://localhost:7071/Authenticate/post-login", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Tokens received from backend:", data);

                localStorage.setItem("accessToken", data.accessToken);
                document.cookie = `refreshToken=${data.refreshToken}; SameSite=Lax;`;
            } else {
                const errorData = await response.json();
                console.error("Failed to fetch tokens:", errorData);
                navigate("/");
            }
            const token = localStorage.getItem("accessToken"); // Ensure 'accessToken' matches the query parameter key

            console.log("Retrieved token from URL:", token);
            const decodedToken = jwtDecode(token);
            console.log("Decoded Token:", decodedToken);

        } catch (error) {
            console.error("Error during post-login:", error);
            navigate("/");
        }
    };

    useEffect(() => {
        handlePostLogin();
    }, []);

    return (
        <div className="home">
            <Header/>
            <AddEmployee/>
            <Footer/>
        </div>
    );
};

export default HomePage;
