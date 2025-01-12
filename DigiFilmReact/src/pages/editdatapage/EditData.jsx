import React, { useEffect } from 'react';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import { Box, Button, TextField } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./EditData.css";

const EditData = () => {
    const location = useLocation(); // Access passed data from the previous navigation
    const [movie, setMovie] = React.useState({
        originalniNaslov: '',
        idEmisije: '',
        radniNaslov: '',
        deskriptori: '',
        jezikOriginala: '',
        ton: '',
        emisija: '',
        porijeklo: '',
        godinaProizvodnje: '',
        duration: '',
        brojMedija: '',
        markIn: '', // Početak filma
        markOut: '', // Kraj filma
    });

    // Fetch the film data and populate the form when the component mounts
    useEffect(() => {
        const filmData = location.state?.film; // Access passed film data
        if (filmData) {
            setMovie({
                originalniNaslov: filmData.originalniNaslov || '',
                idEmisije: filmData.idEmisije || '',
                radniNaslov: filmData.radniNaslov || '',
                deskriptori: filmData.deskriptori || '',
                jezikOriginala: filmData.jezikOriginala || '',
                ton: filmData.ton || '',
                emisija: filmData.emisija || '',
                porijeklo: filmData.porijeklo || '',
                godinaProizvodnje: filmData.godinaProizvodnje || '',
                duration: filmData.duration || '',
                brojMedija: filmData.brojMedija || '',
                markIn: filmData.markIn || '', // Početak filma
                markOut: filmData.markOut || '', // Kraj filma
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
            // API call to update the movie data
            // Example: await updateMovie(movie);
            console.log("Movie data updated successfully.");
            setMovie({
                originalniNaslov: '',
                idEmisije: '',
                radniNaslov: '',
                deskriptori: '',
                jezikOriginala: '',
                ton: '',
                emisija: '',
                porijeklo: '',
                godinaProizvodnje: '',
                duration: '',
                brojMedija: '',
                markIn: '',
                markOut: '',
            });
        } catch (error) {
            console.error("Error editing data:", error);
        }
    };

    return (
        <div className="editData">
            <Header />
            <Box className="edit-data">
                <form className="edit-data__form" onSubmit={handleSubmit}>
                    <fieldset className="edit-data__fieldset">
                        <legend>Edit data</legend>

                        <TextField
                            fullWidth
                            label="Originalni naslov"
                            name="originalniNaslov"
                            placeholder="Originalni naslov"
                            value={movie.originalniNaslov}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="ID Emisije"
                            name="idEmisije"
                            placeholder="ID Emisije"
                            value={movie.idEmisije}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Radni naslov"
                            name="radniNaslov"
                            placeholder="Radni naslov"
                            value={movie.radniNaslov}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Deskriptori"
                            name="deskriptori"
                            placeholder="Deskriptori"
                            value={movie.deskriptori}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Jezik originala"
                            name="jezikOriginala"
                            placeholder="Jezik originala"
                            value={movie.jezikOriginala}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Ton"
                            name="ton"
                            placeholder="Ton"
                            value={movie.ton}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Emisija"
                            name="emisija"
                            placeholder="Emisija"
                            value={movie.emisija}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Porijeklo"
                            name="porijeklo"
                            placeholder="Porijeklo"
                            value={movie.porijeklo}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Godina proizvodnje"
                            name="godinaProizvodnje"
                            placeholder="Godina proizvodnje"
                            value={movie.godinaProizvodnje}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Trajanje"
                            name="duration"
                            placeholder="Trajanje"
                            value={movie.duration}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Broj medija"
                            name="brojMedija"
                            placeholder="Broj medija"
                            value={movie.brojMedija}
                            onChange={handleChange}
                            required
                        />

                        {/* New fields for Početak i Kraj filma */}
                        <TextField
                            fullWidth
                            label="Početak filma (Mark In)"
                            name="markIn"
                            placeholder="HH:MM:SS"
                            value={movie.markIn}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Kraj filma (Mark Out)"
                            name="markOut"
                            placeholder="HH:MM:SS"
                            value={movie.markOut}
                            onChange={handleChange}
                            required
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
