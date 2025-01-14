import React from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import {Button} from "@mui/material";

const HomePage = (/*{userRole}*/) => {
    const navigate = useNavigate();

    return (
        <div className="homepage">
            <Header/>
            <div style={{display: "flex", justifyContent: "center"}}>
                <h1 style={{fontSize: '48px', color: '#5d4037',margin:'32px',}}>Welcome to DigiFilm!</h1>
            </div>
            <div className="list_buttons">
                {/*{userRole !== "readOnly" && (*/}
                    <Button sx={{
                        backgroundColor: "#fafafa",
                        color: "#212121",
                        '&:hover': {
                            backgroundColor: "#9e9e9e",
                        },
                    }}
                            onClick={() => navigate("/scanBarcode")}>
                        Scan barcode
                    </Button>
                {/*}  )}  */}
                <Button  sx={{
                    backgroundColor: "#fafafa",
                    color: "#212121",
                    '&:hover': {
                        backgroundColor: "#9e9e9e",
                    },
                }}
                         onClick={() => navigate("/filmList")}>
                    Film List
                </Button>
                <Button  sx={{
                    backgroundColor: "#fafafa",
                    color: "#212121",
                    '&:hover': {
                        backgroundColor: "#9e9e9e",
                    },
                }}
                         onClick={() => navigate("/sessionList")}>
                    Session List
                </Button>
                {/*{userRole === "admin" && (*/}
                    <Button  sx={{
                        backgroundColor: "#fafafa",
                        color: "#212121",
                        '&:hover': {
                            backgroundColor: "#9e9e9e",
                        },
                    }}
                             onClick={() => navigate("/addEmployee")}>
                        Add employee
                    </Button>
                {/*}  )}  */}
            </div>
            <Footer />
        </div>
    )
}

export default HomePage;