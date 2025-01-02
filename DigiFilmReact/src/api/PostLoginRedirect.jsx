import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PostLoginRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handlePostLogin = async () => {
            try {
                const response = await fetch("https://localhost:7071/Authenticate/post-login", {
                    method: "GET",
                    credentials: "include", // Include cookies for session-based auth
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Post-login response:", data);

                    // Store tokens securely
                    localStorage.setItem("accessToken", data.AccessToken);
                    document.cookie = `refreshToken=${data.RefreshToken}; HttpOnly; Secure; SameSite=Strict`;

                    // Navigate to home page on success
                    navigate("/home");
                } else {
                    console.error("Login failed:", await response.json());
                    navigate("/login"); // Redirect to login page on failure
                }
            } catch (error) {
                console.error("Error during post-login:", error);
                navigate("/login"); // Redirect to login page on error
            }
        };

        handlePostLogin();
    }, [navigate]);

    return <div>Processing login... Please wait.</div>;
};

export default PostLoginRedirect;
