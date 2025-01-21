import React from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import "./ScanBarcode.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/Navbar.jsx';
import "../../css/common.css"

const ScanBarcode = () => {
    const [data, setData] = React.useState('No result');
    const navigate = useNavigate();

    const fetchFilmByBarcode = async (barcode) => {
        try {
            const response = await fetch(`https://localhost:7071/Film/get-film/${barcode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching film:", errorData);
                alert("Film not found or an error occurred.");
                return;
            }

            const filmData = await response.json();
            // Navigate to the editData page with film data in state
            navigate("/editData", { state: { film: filmData.film, isEditing: false } });
        } catch (error) {
            console.error("Error fetching film by barcode:", error);
            alert("An error occurred while fetching the film.");
        }
    };

    return (
        <div className="app-container">
            <Navbar /> {/* Add the Navbar here */}
            <BarcodeScannerComponent
                width="100%"
                height={500}
                onUpdate={(err, result) => {
                    if (result) {
                        setData(result.text);
                        fetchFilmByBarcode(result.text);
                    } else {
                        setData("Not Found");
                    }
                }}
            />
            <div className="box">
                <h1>{data}</h1>
                <Button
                    variant="contained"
                    type="submit"
                    sx={{
                        backgroundColor: "#bcaaa4",
                        color: "#5d4037",
                        '&:hover': {
                            backgroundColor: "#9e9e9e",
                        },
                        width: '60%',
                    }}
                    onClick={() => navigate("/editData")}>
                    Box without barcode?
                </Button>
            </div>
            <Footer />
        </div>
    );
};

export default ScanBarcode;
