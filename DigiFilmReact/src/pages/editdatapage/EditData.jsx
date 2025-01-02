import React from 'react';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import {Box, Button, MenuItem, TextField} from "@mui/material";

const EditData = () => {
    const [movie, setMovie] = React.useState({
        title: '',
        releaseYear: '',
        duration: '',
        genre: '',
        director: '',
        language: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setMovie(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submitting movie:", movie);
        try {
            //await registerEmployee(movie);
            console.log("Movie data entered successfully.");
            setMovie({
                title: '',
                releaseYear: '',
                duration: '',
                genre: '',
                director: '',
                language: ''
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
                            label="Title"
                            name="title"
                            placeholder="Title"
                            value={movie.title}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Release Year"
                            name="releaseYear"
                            placeholder="Release Year"
                            value={movie.releaseYear}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Duration"
                            name="duration"
                            placeholder="Duration"
                            value={movie.duration}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Genre"
                            name="genre"
                            placeholder="Genre"
                            value={movie.genre}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Director"
                            name="director"
                            placeholder="Director"
                            value={movie.director}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Language"
                            name="language"
                            placeholder="Language"
                            value={movie.language}
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
            <Footer/>
        </div>
    )
}

export default EditData;