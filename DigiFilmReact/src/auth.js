import { useNavigate } from "react-router-dom";
let navigate = useNavigate();
export const decodeToken = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = atob(base64);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

export const isAuthenticated = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        navigate("/");
        return false;
    }
    const decodedToken = decodeToken(accessToken);
    if (!decodedToken) {
        navigate("/");
        return false;
    }
    return true;
};
