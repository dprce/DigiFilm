import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Spacer} from "@nextui-org/react";
import Header from "../../components/Header.jsx";
import AddEmployee from "../../components/AddEmployee.jsx";

const HomePage = () => {
    const navigate = useNavigate();

    const handlePostLogin = async () => {
        console.log("handlePostLogin triggered");
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
        } catch (error) {
            console.error("Error during post-login:", error);
            navigate("/");
        }
    };

    useEffect(() => {
        handlePostLogin();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <Header />
            <Spacer y={2} />
            <div style={{ textAlign: "center" }}>
                <Spacer y={1} />
                <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <Card css={{ padding: "20px" }}>
                        <AddEmployee />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
