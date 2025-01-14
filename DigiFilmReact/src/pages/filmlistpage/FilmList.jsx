import { useState, useEffect } from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import { Box, Typography, TextField, Autocomplete, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { jsPDF } from 'jspdf';
import "./FilmList.css";
import { fetchUsers } from '../../api/RoleApi.jsx';
// Fetch films from backend
export async function fetchFilms() {
    try {
        const response = await fetch(`https://localhost:7071/Film/get-all-films`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            return data.films;
        } else {
            console.error('Failed to fetch films. Status:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error fetching films:', error);
        return [];
    }
}

const FilmList = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [batches, setBatches] = useState([]);
    const [totalSelectedDuration, setTotalSelectedDuration] = useState(0);
    const [warning, setWarning] = useState(false);
    //const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState();
    const [comments, setComments] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const data = await fetchFilms();
            const mappedMovies = data.map(film => ({
                id: film.idEmisije,
                title: film.originalniNaslov,
                language: film.jezikOriginala,
                country: film.porijeklo_ZemljaProizvodnje,
                year: film.godinaProizvodnje,
                duration: film.duration,
                status: film.status,
            }));
            setMovies(mappedMovies);
            setFilteredMovies(mappedMovies);
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        const loadUsers = async () => {
            const data = await fetchUsers(); // Fetch users from the API
            const mappedUsers = data.map(user => ({
                label: `${user.firstName} ${user.lastName}`, // Concatenate first and last name
                id: user.id, // Use unique identifier for user
            }));
            setUsers(mappedUsers); // Set users in state
        };

        loadUsers();
    }, []);

    const parseDuration = (duration) => {
        const [hours, minutes, seconds] = duration.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return [hours, minutes, secs].map(v => String(v).padStart(2, '0')).join(":");
    };

    const handleSelect = (id) => {
        const movie = movies.find((m) => m.id === id);

        // Allow selection only for non-digitalized films
        if (movie.status != "Not Digitalized") {
            return; // Skip selection for digitalized films
        }

        const movieDuration = parseDuration(movie.duration);

        if (selectedMovies.includes(movie)) {
            setSelectedMovies(selectedMovies.filter((m) => m.id !== id));
            setTotalSelectedDuration(totalSelectedDuration - movieDuration);
            if (totalSelectedDuration - movieDuration < 45 * 60) {
                setWarning(false);
            }
        } else {
            setSelectedMovies([...selectedMovies, movie]);
            setTotalSelectedDuration(totalSelectedDuration + movieDuration);
            if (totalSelectedDuration + movieDuration > 45 * 60) {
                setWarning(true);
            }
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredMovies(movies);
        } else {
            const lowerCaseQuery = query.toLowerCase();
            const result = movies.filter(movie =>
                movie.title.toLowerCase().includes(lowerCaseQuery) ||
                movie.language.toLowerCase().includes(lowerCaseQuery) ||
                movie.country.toLowerCase().includes(lowerCaseQuery) ||
                movie.year.toString().includes(lowerCaseQuery) ||
                movie.status.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredMovies(result);
        }
    };

    const groupMoviesIntoBatches = () => {
        const maxBatchDuration = 45 * 60; // 2700 seconds
        const moviesWithSeconds = selectedMovies.map(movie => ({
            ...movie,
            durationInSeconds: parseDuration(movie.duration),
        }));

        const groupedBatches = [];

        // Greedy algorithm for bin-packing
        while (moviesWithSeconds.length > 0) {
            let currentBatch = [];
            let remainingTime = maxBatchDuration;

            for (let i = 0; i < moviesWithSeconds.length; i++) {
                if (moviesWithSeconds[i].durationInSeconds <= remainingTime) {
                    currentBatch.push(moviesWithSeconds[i]);
                    remainingTime -= moviesWithSeconds[i].durationInSeconds;
                    moviesWithSeconds.splice(i, 1);
                    i--; // Adjust index after removal
                }
            }

            groupedBatches.push(currentBatch);
        }

        setBatches(groupedBatches);
        setTotalSelectedDuration(0);
        setWarning(false);
    };

    const generatePDF = () => {
        if (!selectedEmployee) {
            alert("Please select an employee before generating the PDF.");
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Report: Archive material digitalization", 20, 20);

        doc.setFontSize(12);
        doc.text(`Employee: ${selectedEmployee.label}`, 20, 30);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
        doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 50);

        let yPosition = 70;
        selectedMovies.forEach((movie, index) => {
            doc.text(`${index + 1}. ${movie.title} (${movie.language}, ${movie.country}, ${movie.year})`, 20, yPosition);
            yPosition += 10;

            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });

        if (comments) {
            doc.text(`Comments: ${comments}`, 20, yPosition);
        }

        doc.save(`Digitalization_${new Date().toISOString()}.pdf`);
    };

    return (
        <div className="filmlist">
            <Header />
            <Box sx={{ padding: "20px" }}>
                <Typography variant="h4" gutterBottom>
                    Film List
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Typography variant="h6">
                    Total Selected Duration: {formatDuration(totalSelectedDuration)}
                </Typography>
                <Box display="flex" gap={2} mt={2} mb={4}>
                    {selectedMovies.length > 0 && (
                        <Button variant="contained" color="primary" onClick={groupMoviesIntoBatches}>
                            Optimize
                        </Button>
                    )}
                    {warning && (
                        <Typography color="error">
                            Warning: Total selected duration exceeds 45 minutes!
                        </Typography>
                    )}
                </Box>
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Select</TableCell>
                                <TableCell>Original Title</TableCell>
                                <TableCell>Language</TableCell>
                                <TableCell>Country</TableCell>
                                <TableCell>Year</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredMovies.map((movie) => (
                                <TableRow key={movie.id} hover>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={selectedMovies.includes(movie)}
                                            onChange={() => handleSelect(movie.id)}
                                            disabled={movie.status === "Digitalized"}
                                        />
                                    </TableCell>
                                    <TableCell>{movie.title}</TableCell>
                                    <TableCell>{movie.language}</TableCell>
                                    <TableCell>{movie.country}</TableCell>
                                    <TableCell>{movie.year}</TableCell>
                                    <TableCell>{movie.duration}</TableCell>
                                    <TableCell>{movie.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {batches.length > 0 && (
                    <Box mt={4}>
                        {batches.map((batch, batchIndex) => (
                            <div key={batchIndex}>
                                <Typography variant="h6">Batch {batchIndex + 1}</Typography>
                                <ul>
                                    {batch.map((movie) => (
                                        <li key={movie.id}>{movie.title} ({formatDuration(movie.durationInSeconds)})</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </Box>
                )}
                <Autocomplete
                    options={users} // List of users
                    value={selectedEmployee} // Currently selected employee
                    getOptionLabel={(option) => option.label} // Display concatenated first and last name
                    onChange={(e, newValue) => setSelectedEmployee(newValue)} // Update selected employee
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}> {/* Use unique `id` as the key */}
                            {option.label}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} label="Responsible Employee" variant="outlined" fullWidth />
                    )}
                    sx={{ mt: 4 }}
                />

                <TextField
                    label="Comments"
                    variant="outlined"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mt: 2 }}
                />
                {selectedMovies.length > 0 && (
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 4 }}
                        onClick={generatePDF}
                    >
                        Generate PDF
                    </Button>
                )}
            </Box>
            <Footer />
        </div>
    );
};



export default FilmList;
