import React, { useEffect } from "react";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Navbar from "../../components/Navbar.jsx";
import "../../css/common.css";
import filmtape from "../../../public/filmtape.jpg";

const decodeToken = (token) => {
    try {
        const base64Url = token.split(".")[1]; // Extract the payload part
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = atob(base64); // Decode base64 string
        return JSON.parse(decodedPayload); // Parse the JSON string
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
<<<<<<< HEAD
        // Check if the user is authenticated
        //if (!isAuthenticated()) return;
=======
        // Get query parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");
        const refreshToken = urlParams.get("refreshToken");
>>>>>>> parent of 30d1359 (Authentication check)

        if (accessToken && refreshToken) {
            // Store tokens in localStorage
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            // Decode the access token and extract the role
            const decodedToken = decodeToken(accessToken);
            if (decodedToken) {
                const { role } = decodedToken;
                localStorage.setItem("role", role); // Store the role in localStorage
                console.log("Decoded Role:", role);
            } else {
                console.warn("Failed to decode access token.");
            }

            // Remove tokens from the URL after saving them
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        } else {
            console.warn("Tokens not found in URL. Redirecting to login...");
            navigate("/login"); // Redirect to login page if tokens are missing
        }
    }, [navigate]);

    return (
        <div className="app-container">
            <Navbar /> {/* Add the Navbar here */}
            <div
                style={{
                    display: "flex",
                    paddingTop: "32px",
                    alignItems: "center",
                    flexDirection: "column",
                    flex: "1",
                }}
            >
                <div
                    className="main-container"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "32px",
                        alignItems: "center",
                        paddingLeft: "40px",
                    }}
                >
                    <img
                        src={filmtape}
                        alt="My Local Image"
                        width="120px"
                        height="120px"
                        style={{ borderRadius: "10px" }}
                    />
                    <h1
                        style={{
                            color: "#5d4037",
                            textAlign: "center",
                            fontStyle: "oblique",
                        }}
                    >
                        Welcome to DigiFilm!
                    </h1>
                </div>
                <h4
                    style={{
                        color: "#5d4037",
                        display: "flex",
                        margin: "0px 40px",
                        marginTop: "20px",
                        fontStyle: "inherit",
                        fontWeight: "400",
                    }}
                >
                    Film technology in the past was completely based on the storage of
                    film materials on film tapes. Today, this method of storage and
                    reproduction is no longer used. However, there is still a large number
                    of archival film materials that are still stored on film tapes, and
                    whose preservation is of great importance for our culture, education,
                    and entertainment. That's why this app was created, it will enable you
                    to track and facilitate the digitization of film materials.
                </h4>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
