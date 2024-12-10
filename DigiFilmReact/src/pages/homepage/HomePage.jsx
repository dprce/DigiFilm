import React, {useEffect, useState} from 'react';
import Header from "../../components/Header.jsx";
import { Html5QrcodeScanner } from "html5-qrcode";
import Footer from "../../components/Footer.jsx";

const HomePage = () => {
    const [data, setData] = useState('No result');
    const [scanResult, setScanResult] = useState(null);

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
        <>
            <Header/>
            {
                scanResult ? (
                    <div>Success: {scanResult}</div>
                ) : (
                    <div id="reader"></div>
                )
            }
            <div id="reader"></div>
            <Footer />
        </>
    )
}

export default HomePage;