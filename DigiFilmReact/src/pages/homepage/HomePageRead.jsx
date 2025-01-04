import React, {useEffect, useState} from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "./HomePage.css";
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePageRead = () => {
    const [movies, setMovies] = useState('No result');
    const navigate = useNavigate();

    // Sample data - replace with your API call or import
    const sampleMovies = [
        {
            title: "Inception",
            releaseYear: 2010,
            duration: "148 min",
            genre: "Sci-Fi",
            director: "Christopher Nolan",
            language: "English",
        },
        {
            title: "Parasite",
            releaseYear: 2019,
            duration: "132 min",
            genre: "Thriller",
            director: "Bong Joon-ho",
            language: "Korean",
        },
        // Add more movies here
    ];

    useEffect(() => {
        setMovies(sampleMovies);
    })

    return (
        <div className="homepageread">
            <Header/>

            <Footer />
        </div>
    )
}

export default HomePageRead;