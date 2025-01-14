import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    LinearProgress,
    Card,
    CardContent,
    Snackbar,
    Alert,
    MenuItem,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { jsPDF } from "jspdf";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Navbar from "../../components/Navbar.jsx";

// Fetch films from backend
export async function fetchFilms() {
    try {
        const response = await fetch(`https://localhost:7071/Film/get-all-films`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            return data.films;
        } else {
            console.error("Failed to fetch films. Status:", response.status);
            return [];
        }
    } catch (error) {
        console.error("Error fetching films:", error);
        return [];
    }
}

// Fetch users from backend
export async function fetchUsers() {
    try {
        const response = await fetch(`https://localhost:7071/User/all-users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            return data.users;
        } else {
            console.error("Failed to fetch users. Status:", response.status);
            return [];
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

const FilmList = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [batches, setBatches] = useState([]);
    const [disableGeneratePdf, setDisableGeneratePdf] = useState(false);
    const [totalSelectedDuration, setTotalSelectedDuration] = useState(0);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [loading, setLoading] = useState(false); // Spinner state
    const [dialogOpen, setDialogOpen] = useState(false); // Dialog state
    const [dialogMessage, setDialogMessage] = useState(""); // Dialog message

    const theme = createTheme({
        typography: {
            fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            h4: { fontWeight: 700 },
            h6: { fontWeight: 500 },
        },
        palette: {
            primary: { main: "#1976d2" },
            secondary: { main: "#ff4081" },
        },
    });

    useEffect(() => {
        const fetchMovies = async () => {
            const data = await fetchFilms();
            const mappedMovies = data.map((film) => ({
                id: film.id,
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

        const loadUsers = async () => {
            const data = await fetchUsers();
            const mappedUsers = data.map((user) => ({
                label: `${user.firstName} ${user.lastName}`,
                id: user.id,
            }));
            setUsers(mappedUsers);
        };

        fetchMovies();
        loadUsers();
    }, []);

    const confirmBatches = async () => {
        if (!selectedUser || batches.length === 0) {
            setDialogMessage("Please select a responsible user and ensure batches are created.");
            setDialogOpen(true);
            return;
        }

        const requestBody = {
            Batches: batches.map((batch) => batch.map((movie) => parseInt(movie.id))),
            CreatedBy: selectedUser,
        };

        try {
            setLoading(true); // Show spinner
            const response = await fetch("https://localhost:7071/Film/confirm-batches", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Use credentials for authentication
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();
            if (response.ok) {
                setDialogMessage(result.message || "Batches and movies successfully updated.");
            } else {
                setDialogMessage(result.message || "An error occurred while confirming batches.");
            }
        } catch (error) {
            setDialogMessage("An unexpected error occurred while confirming batches.");
        } finally {
            setLoading(false); // Hide spinner
            setDialogOpen(true); // Show dialog with message
        }
    };

    const parseDuration = (duration) => {
        const [hours, minutes, seconds] = duration.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return [hours, minutes, secs].map((v) => String(v).padStart(2, "0")).join(":");
    };

    const handleSelect = (id) => {
        const movie = movies.find((m) => m.id === id);
        const movieDuration = parseDuration(movie.duration);

        if (selectedMovies.includes(movie)) {
            setSelectedMovies(selectedMovies.filter((m) => m.id !== id));
            setTotalSelectedDuration(totalSelectedDuration - movieDuration);
        } else {
            setSelectedMovies([...selectedMovies, movie]);
            setTotalSelectedDuration(totalSelectedDuration + movieDuration);
        }
    };

    const groupMoviesIntoBatches = () => {
        const maxBatchDuration = 45 * 60; // 2700 seconds

        const moviesWithSeconds = selectedMovies.map((movie) => ({
            ...movie,
            durationInSeconds: parseDuration(movie.duration),
        }));

        const groupedBatches = [];

        // Assign movies to batches
        for (const movie of moviesWithSeconds) {
            let addedToBatch = false;

            for (const batch of groupedBatches) {
                const batchDuration = batch.reduce((sum, m) => sum + m.durationInSeconds, 0);
                if (batchDuration + movie.durationInSeconds <= maxBatchDuration) {
                    batch.push(movie);
                    addedToBatch = true;
                    break;
                }
            }

            if (!addedToBatch) {
                groupedBatches.push([movie]);
            }
        }

        setBatches(groupedBatches);

        // Validate and disable Generate PDF button if any batch exceeds limit
        const isInvalid = groupedBatches.some(
            (batch) => batch.reduce((sum, movie) => sum + movie.durationInSeconds, 0) > maxBatchDuration
        );
        setDisableGeneratePdf(isInvalid);
    };

    const optimizeBatches = () => {
        setBatches([]);
        groupMoviesIntoBatches(); // Recalculate batches to optimize durations
    };

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return; // If dropped outside a droppable area

        const sourceBatchIndex = source.droppableId;
        const destinationBatchIndex = destination.droppableId;

        const updatedBatches = [...batches];
        const [movedMovie] = updatedBatches[sourceBatchIndex].splice(source.index, 1);

        updatedBatches[destinationBatchIndex].splice(destination.index, 0, movedMovie);

        const destinationBatchDuration = updatedBatches[destinationBatchIndex].reduce(
            (sum, movie) => sum + movie.durationInSeconds,
            0
        );

        // Check if the destination batch exceeds 45 minutes
        if (destinationBatchDuration > 45 * 60) {
            setShowWarning(true); // Show warning
            setDisableGeneratePdf(true); // Disable Generate PDF button
        } else {
            setDisableGeneratePdf(false); // Enable Generate PDF button
        }

        setBatches(updatedBatches);
    };

    const handleReset = () => {
        setBatches([]);
        setSelectedMovies([]);
        setTotalSelectedDuration(0);
        setSelectedUser("");
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Report: Archive Material Digitalization", 20, 20);

        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
        doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 50);

        if (selectedUser) {
            doc.text(`Responsible User: ${selectedUser}`, 20, 60);
        }

        let yPosition = 80;
        selectedMovies.forEach((movie, index) => {
            doc.text(`${index + 1}. ${movie.title}`, 20, yPosition);
            yPosition += 10;

            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });

        doc.save("Report.pdf");
    };

    const handleGeneratePDF = async () => {
        await confirmBatches(); // First, confirm batches by sending data to the backend
        generatePDF(); // Then, generate the PDF
    };

    const handleDialogClose = () => {
        setDialogOpen(false); // Close dialog
        window.location.reload(); // Reload page
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="filmlist">
                <Navbar />
                <Header />
                <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto", display: "flex", gap: 3 }}>
                    {/* Film List */}
                    <Box flex={2}>
                        <Typography variant="h4" gutterBottom>
                            Film List
                        </Typography>
                </Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Select</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Language</TableCell>
                                        <TableCell>Country</TableCell>
                                        <TableCell>Year</TableCell>
                                        <TableCell>Duration</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredMovies.map((movie) => (
                                        <TableRow key={movie.id}>
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMovies.includes(movie)}
                                                    onChange={() => handleSelect(movie.id)}
                                                    disabled={movie.status !== "Not Digitalized"}
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
                    </Box>

                    {/* Batches, Summary, and User Selection */}
                    <Box flex={1}>
                        <Card sx={{ mb: 3, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6">Total Selected Movies</Typography>
                                <Typography variant="h4">{selectedMovies.length}</Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ mb: 3, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6">Total Selected Duration</Typography>
                                <Typography variant="h4">{formatDuration(totalSelectedDuration)}</Typography>
                            </CardContent>
                        </Card>
                        <TextField
                            select
                            label="Responsible User"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.label}>
                                    {user.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={groupMoviesIntoBatches}
                            sx={{ mb: 2 }}
                        >
                            Group Movies into Batches
                        </Button>
                        <Button
                            variant="outlined"
                            color="warning"
                            onClick={handleReset}
                            sx={{ mb: 2 }}
                        >
                            Reset
                        </Button>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            {batches.map((batch, index) => (
                                <Droppable droppableId={`${index}`} key={index}>
                                    {(provided) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            mb={3}
                                            p={2}
                                            border="1px solid #ccc"
                                            borderRadius={2}
                                        >
                                            <Typography variant="h6">
                                                Batch {index + 1} - Total Duration:{" "}
                                                {formatDuration(
                                                    batch.reduce((sum, movie) => sum + movie.durationInSeconds, 0)
                                                )}
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={
                                                    (batch.reduce((sum, movie) => sum + movie.durationInSeconds, 0) /
                                                        (45 * 60)) *
                                                    100
                                                }
                                                sx={{ height: 10, borderRadius: 5 }}
                                            />
                                            <Box mt={2}>
                                                <ul>
                                                    {batch.map((movie, movieIndex) => (
                                                        <Draggable
                                                            key={movie.id}
                                                            draggableId={movie.id.toString()}
                                                            index={movieIndex}
                                                        >
                                                            {(provided) => (
                                                                <li
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    {movie.title} - {formatDuration(movie.durationInSeconds)}
                                                                </li>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                </ul>
                                                {provided.placeholder}
                                            </Box>
                                        </Box>
                                    )}
                                </Droppable>
                            ))}
                        </DragDropContext>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleGeneratePDF}
                            disabled={disableGeneratePdf || !selectedUser || batches.length === 0}
                            sx={{
                                backgroundColor: disableGeneratePdf || !selectedUser || batches.length === 0 ? "gray" : undefined,
                                cursor: disableGeneratePdf || !selectedUser || batches.length === 0 ? "not-allowed" : "pointer",
                            }}
                        >
                            Confirm batches and generate pdf
                        </Button>
                    </Box>
                </Box>

                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                            zIndex: 1000,
                        }}
                    >
                        <CircularProgress size={80} />
                    </Box>
                )}

                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{dialogMessage}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>

                <Footer />
            </div>
        </ThemeProvider>
    );
};

export default FilmList;
