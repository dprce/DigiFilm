import {useState, useEffect} from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "./FilmList.css";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import {Button, Box, Typography, TextField, MenuItem, Select, Autocomplete} from "@mui/material";
import { jsPDF } from 'jspdf';
import { user } from "@nextui-org/theme";

const FilmList = () => {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredMovies, setFilteredMovies] = useState(movies);
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [batches, setBatches] = useState([]);
    const [totalSelectedDuration, setTotalSelectedDuration] = useState(0);
    const [warning, setWarning] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState();
    const [comments, setComments] = useState("");

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch('/movies.json');
            const data = await response.json();
            setMovies(data);
            setFilteredMovies(data);
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await fetch('/employees.json');
            const data = await response.json();
            setEmployees(data);
        }

        fetchEmployees();
    }, []);

    const parseDuration = (duration) => {
        const [hours, minutes, seconds] = duration.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds; //trajanje ukupno u sekundama
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return [hours, minutes, secs].map(v => String(v).padStart(2, '0')).join(":");
    };

    const handleSelect = (id) =>{
        const movie = movies.find(m => m.id === id);
        const movieDuration = parseDuration(movie.duration);

        if (selectedMovies.includes(movie)){
            setSelectedMovies(selectedMovies.filter(m => m.id !== id));
            setTotalSelectedDuration(totalSelectedDuration - movieDuration);
            if (totalSelectedDuration - movieDuration < 45 * 60){
                setWarning(false);
            }
        } else {
            setSelectedMovies([...selectedMovies, movie]);
            setTotalSelectedDuration(totalSelectedDuration + movieDuration);
            if (totalSelectedDuration + movieDuration > 45 * 60){
                setWarning(true);
            }
        }

        /*if (totalSelectedDuration + movieDuration > 45 * 60){
            setWarning(true);
        } else {
            setWarning(false);
        }*/
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if(query.trim() === ""){
            setFilteredMovies(movies);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const result = movies.filter((movie) =>
                movie.title.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredMovies(result);
        }
    }

    const groupMoviesIntoBatches = () => {
        const moviesWithSeconds = selectedMovies.map(movie => ({
            ...movie,
            durationInSeconds: parseDuration(movie.duration),
        }));
        const maxBatchDuration = 45 * 60;
        const groupedBatches = [];

        while (moviesWithSeconds.length > 0) {
            let currentBatch = [];
            let remainingTime = maxBatchDuration;

            moviesWithSeconds.sort((a, b) => b.durationInSeconds - a.durationInSeconds);

            for (let i = moviesWithSeconds.length - 1; i >= 0; i--) {
                if (moviesWithSeconds[i].durationInSeconds <= remainingTime) {
                    currentBatch.push(moviesWithSeconds[i]);
                    remainingTime -= moviesWithSeconds[i].durationInSeconds;
                    moviesWithSeconds.splice(i, 1);
                }
            }

            groupedBatches.push(currentBatch);
        }

        setBatches(groupedBatches);
        setTotalSelectedDuration(0);
        setWarning(false);
        //setSelectedMovies([]);
    };

    const generatePDF = () => {
        if (!selectedEmployee) {
            alert("Please select an employee before generating the PDF.");
            return;
        }

        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Report: archive material digitalization", 20, 20);

        let yPosition = 60;

        doc.setFontSize(12);
        doc.text(`Employee: ${selectedEmployee}`, 20, 30);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
        doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 50);
        yPosition = yPosition + 10;

        batches.forEach((batch, batchIndex) => {
            doc.setFontSize(14);
            doc.text(`Batch ${batchIndex + 1}:`, 20, yPosition);
            yPosition = yPosition + 10;

            doc.setFontSize(12);
            batch.forEach((movie, index) => {
                doc.text(`${index + 1}. ${movie.title} (${formatDuration(movie.durationInSeconds)}) ${movie.barcode}`, 20, yPosition);
                yPosition = yPosition + 10;

                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
            });

            const totalBatchDuration = batch.reduce((sum, movie) => sum + movie.durationInSeconds, 0);
            doc.text(`Total batch duration: ${formatDuration(totalBatchDuration)}`, 20, yPosition);
            yPosition = yPosition + 20;

            if(yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });

        {comments && (
            doc.text(`Comments: ${comments}`, 20, yPosition)
        )}
        yPosition = yPosition + 20;

        if(yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }

        doc.save(`Digitalization_${new Date().toISOString()}.pdf`);
        for (let i = 0; i < selectedMovies.length; i++){
            selectedMovies[i].digitalized = "On digitalization";
        }
        setSelectedMovies([]);
    }

    return (
        <div className="filmlist">
            <Header/>
            <Box sx={{padding: "20px"}}>
                <div>
                    <h2>Film List</h2>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <TextField
                            label="Search"
                            variant="outlined"
                            value={searchQuery}
                            /*onChange={(e) => setSearchQuery(e.target.value)}*/
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {/*<Button
                            variant="contained"
                            onClick={handleSearch}
                        >
                            Search
                        </Button>*/}
                    </Box>
                    <Typography>
                        Total Selected Duration: {formatDuration(totalSelectedDuration)}
                    </Typography>
                    <div style={{ display: 'flex', paddingTop: '10px', paddingBottom: '10px' }}>
                        {selectedMovies.length > 0 && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={groupMoviesIntoBatches}
                            >
                                Optimize
                            </Button>
                        )}
                        {warning && (
                            <Typography color="error" style={{paddingTop: '5px', marginLeft: '20px'}}>
                                Warning: Total selected duration exceeds 45 minutes!
                            </Typography>
                        )}
                    </div>
                </div>
                <Table aria-label="film table">
                    <TableHeader>
                        <TableColumn>SELECT</TableColumn>
                        <TableColumn>TITLE</TableColumn>
                        <TableColumn>RELEASE YEAR</TableColumn>
                        <TableColumn>LANGUAGE</TableColumn>
                        <TableColumn>DURATION</TableColumn>
                        <TableColumn>DIGITALIZED</TableColumn>
                        <TableColumn>BARCODE NO.</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {filteredMovies.map(movie => (
                            <TableRow key={movie.id}>
                            <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedMovies.includes(movie)}
                                        onChange={() => handleSelect(movie.id)}
                                    />
                                </TableCell>
                                <TableCell>{movie.title}</TableCell>
                                <TableCell>{movie.year}</TableCell>
                                <TableCell>{movie.language}</TableCell>
                                <TableCell>{movie.duration}</TableCell>
                                <TableCell>{movie.digitalized}</TableCell>
                                <TableCell>{movie.barcode}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {batches.length > 0 && (
                    <>
                        <Box mb={2} style={{marginTop: "10px"}}>
                            {/*<Select
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                placeholder="Select employee"
                                style={{ width: "200px" }}
                            >
                                {employees.map((employee, index) => (
                                    <MenuItem key={index} value={employee}>
                                        {employee}
                                    </MenuItem>
                                ))}
                            </Select>*/}
                            <Autocomplete
                                freeSolo
                                options={employees}
                                value={selectedEmployee}
                                onChange={(e, newValue) => setSelectedEmployee(newValue)}
                                style={{width: "25%"}}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Responsible Employee"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Box>
                        <TextField
                            label="Comments"
                            variant="outlined"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            style={{width: "50%"}}
                        />
                        {batches.map((batch, batchIndex) => (
                            <div key={batchIndex} style={{ marginTop: "20px" }}>
                                <h3>Batch {batchIndex + 1}</h3>
                                <ul>
                                    {batch.map(movie => (
                                        <li key={movie.id}>
                                            {movie.title} ({formatDuration(movie.durationInSeconds)})
                                        </li>
                                    ))}
                                </ul>
                                <p>
                                    Total Duration:{" "}
                                    {formatDuration(
                                        batch.reduce((sum, movie) => sum + movie.durationInSeconds, 0)
                                    )}
                                </p>
                            </div>
                        ))}
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={generatePDF}
                        >
                            Confirm
                        </Button>
                    </>
                )}
            </Box>
            <Footer />
        </div>
    );
};

export default FilmList;