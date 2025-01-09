import React from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import "./ScanBarcode.css";
import {Button} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ScanBarcode = () => {
    const [data, setData] = React.useState('No result');
    const navigate = useNavigate();

    return (
        <div className="scanbarcode">
            <Header/>
            <BarcodeScannerComponent
                width="100%"
                height={500}
                onUpdate={(err, result) => {
                    if(result) setData(result.text); //TU NAVIGIRATI NA EDITDATA AKO USPJEŠNO SKENIRANO
                    else setData("Not Found");
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
                        width:'512px',
                    }}
                    onClick={() => navigate("/editData")}>
                    Box without barcode?
                </Button>
            </div>
            <Footer />
        </div>
    )
}

export default ScanBarcode;