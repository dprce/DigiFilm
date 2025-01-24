import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import { Box, Button, TextField } from "@mui/material";
import { useLocation } from "react-router-dom";
import "../../css/common.css"
import "./EditData.css";
import checkAuthentication from "../../auth.js";

const EditData = () => {
    const location = useLocation();
    const { isAuthenticated } = checkAuthentication();

    const [movie, setMovie] = React.useState({
        Id: 0,
        OriginalniNaslov: '',
        IDEmisije: '',
        RadniNaslov: '',
        JezikOriginala: '',
        Ton: '',
        Emisija: '',
        Porijeklo_ZemljaProizvodnje: '',
        GodinaProizvodnje: '',
        Duration: '',
        BrojMedija: '',
        MarkIn: '',
        MarkOut: '',
        BarCode: ''
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            return;
        }
        const filmData = location.state?.film;
        if (filmData) {
            setMovie({
                Id: filmData.id,
                OriginalniNaslov: filmData.originalniNaslov || filmData.title || '',
                IDEmisije: filmData.idEmisije || '',
                RadniNaslov: filmData.radniNaslov || '',
                JezikOriginala: filmData.jezikOriginala || filmData.language || '',
                Ton: filmData.ton || '',
                Emisija: filmData.emisija || '',
                Porijeklo_ZemljaProizvodnje: filmData.porijeklo_ZemljaProizvodnje || filmData.country || '',
                GodinaProizvodnje: filmData.godinaProizvodnje || filmData.year || '',
                Duration: filmData.duration || '',
                BrojMedija: filmData.brojMedija || '',
                MarkIn: filmData.markIn || '',
                MarkOut: filmData.markOut || '',
                BarCode: filmData.barCode || ''
            });
        }
        console.log(movie);
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovie(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submitting movie:", movie);

        const apiEndpoint = location.state?.isEditing === true
            ? `https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Film/edit-scanned-film` // Editing endpoint
            : `https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Film/submit-scanned-film`; // Insertion endpoint

        try {
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(movie),
                credentials: "include"
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error submitting/editing movie:", errorData);
                alert(`Error: ${errorData.message}`);
                return;
            }

            const responseData = await response.json();
            console.log("Movie data updated/submitted successfully:", responseData.message);
            alert("Movie data submitted successfully!");

            setMovie({
                Id: 0,
                OriginalniNaslov: '',
                IDEmisije: '',
                RadniNaslov: '',
                JezikOriginala: '',
                Ton: '',
                Emisija: '',
                Porijeklo_ZemljaProizvodnje: '',
                GodinaProizvodnje: '',
                Duration: '',
                BrojMedija: '',
                MarkIn: '',
                MarkOut: '',
                BarCode: ''
            });
        } catch (error) {
            console.error("Error during API call:", error);
            alert("An error occurred while submitting the movie data.");
        }
    };

    return (
        <div className="app-container">
            <Navbar /> {/* Add the Navbar here */}
            <Box className="edit-data">
                <form className="edit-data__form" onSubmit={handleSubmit}>
                    <fieldset className="edit-data__fieldset">
                        <legend>Edit data</legend>

                        <TextField
                            fullWidth
                            label="Originalni Naslov"
                            name="OriginalniNaslov"
                            placeholder="Originalni Naslov"
                            value={movie.OriginalniNaslov}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="ID Emisije"
                            name="IDEmisije"
                            placeholder="ID Emisije"
                            value={movie.IDEmisije}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Radni Naslov"
                            name="RadniNaslov"
                            placeholder="Radni Naslov"
                            value={movie.RadniNaslov}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Jezik Originala"
                            name="JezikOriginala"
                            placeholder="Jezik Originala"
                            value={movie.JezikOriginala}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Ton"
                            name="Ton"
                            placeholder="Ton"
                            value={movie.Ton}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Emisija"
                            name="Emisija"
                            placeholder="Emisija"
                            value={movie.Emisija}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Porijeklo Zemlja Proizvodnje"
                            name="Porijeklo_ZemljaProizvodnje"
                            placeholder="Porijeklo Zemlja Proizvodnje"
                            value={movie.Porijeklo_ZemljaProizvodnje}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Godina Proizvodnje"
                            name="GodinaProizvodnje"
                            placeholder="Godina Proizvodnje"
                            value={movie.GodinaProizvodnje}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Trajanje"
                            name="Duration"
                            placeholder="Trajanje"
                            value={movie.Duration}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Broj Medija"
                            name="BrojMedija"
                            placeholder="Broj Medija"
                            value={movie.BrojMedija}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Mark In"
                            name="MarkIn"
                            placeholder="HH:MM:SS"
                            value={movie.MarkIn}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Mark Out"
                            name="MarkOut"
                            placeholder="HH:MM:SS"
                            value={movie.MarkOut}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Bar Code"
                            name="BarCode"
                            placeholder="Bar Code"
                            value={movie.BarCode}
                            onChange={handleChange}
                            
                        />

                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            sx={{
                                backgroundColor: "#bcaaa4",
                                color: "#5d4037",
                                '&:hover': {
                                    backgroundColor: "#9e9e9e",
                                },
                            }}
                        >
                            {location.state?.isEditing === true ? "Edit movie" : "Submit movie"}
                        </Button>
                    </fieldset>
                </form>
            </Box>
            <Footer />
        </div>
    );
};

export default EditData;
