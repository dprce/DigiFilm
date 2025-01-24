import { useNavigate } from "react-router-dom";

const checkAuthentication = () => {
    const navigate = useNavigate();

    const isAuthenticated = () => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accessToken || !refreshToken) {
            console.warn("User is not authenticated. Redirecting to login...");
            navigate("/"); // Redirect to login page
            return false;
        }
        return true;
    };

    return { isAuthenticated };
};

export default checkAuthentication;
