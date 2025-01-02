import React, {useEffect, useState} from 'react';
import Header from "../../components/Header.jsx";
import { Html5QrcodeScanner } from "html5-qrcode";
import Footer from "../../components/Footer.jsx";
import "./HomePage.css";
import {Button} from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [data, setData] = useState('No result');
    const [scanResult, setScanResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });

        scanner.render(success, error);

        function success(result) {
            scanner.clear();
            setScanResult(result);
        }

        function error(err) {
            console.warn(err);
        }
    },[]);

    return (
        <div className="homepage">
            <Header/>
            {
                scanResult ? (
                    navigate("/editData")
                ) : (
                    <div id="reader"></div>
                )
            }
            <div id="reader"></div>
            <Button onClick={() => navigate("/editData")}>Box without barcode?</Button>
            <Footer />
        </div>
    )
}

export default HomePage;