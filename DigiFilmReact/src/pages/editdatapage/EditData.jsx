import React, { useEffect } from 'react';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import { Box, Button, TextField } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./EditData.css";

const EditData = () => {
    const location = useLocation();
    const [movie, setMovie] = React.useState({
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
        const filmData = location.state?.film;
        if (filmData) {
            setMovie({
                OriginalniNaslov: filmData.OriginalniNaslov || '',
                IDEmisije: filmData.IDEmisije || '',
                RadniNaslov: filmData.RadniNaslov || '',
                JezikOriginala: filmData.JezikOriginala || '',
                Ton: filmData.Ton || '',
                Emisija: filmData.Emisija || '',
                Porijeklo_ZemljaProizvodnje: filmData.Porijeklo_ZemljaProizvodnje || '',
                GodinaProizvodnje: filmData.GodinaProizvodnje || '',
                Duration: filmData.Duration || '',
                BrojMedija: filmData.BrojMedija || '',
                MarkIn: filmData.MarkIn || '',
                MarkOut: filmData.MarkOut || '',
                BarCode: filmData.BarCode || ''
            });
        }
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

        try {
            const response = await fetch("https://localhost:7071/Film/submit-scanned-film", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(movie),
                credentials: "include"
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error submitting movie:", errorData);
                alert(`Error: ${errorData.message}`);
                return;
            }

            const responseData = await response.json();
            console.log("Movie data updated successfully:", responseData.message);
            alert("Movie data submitted successfully!");

            setMovie({
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
        <div className="editData">
            <Header />
            <Box className="edit-data">
                <form className="edit-data__form" onSubmit={handleSubmit}>
                    <fieldset className="edit-data__fieldset">
                        <legend>Edit data</legend>

                        {Object.keys(movie).map((key) => (
                            <TextField
                                key={key}
                                fullWidth
                                label={key.replace(/([A-Z])/g, ' $1').trim()}
                                name={key}
                                placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
                                value={movie[key]}
                                onChange={handleChange}
                                required
                            />
                        ))}

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
                            Submit data
                        </Button>
                    </fieldset>
                </form>
            </Box>
            <Footer />
        </div>
    );
};

export default EditData;
