import React, {useState} from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "./FilmList.css";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import {Button, Box, Typography} from "@mui/material";
import { jsPDF } from 'jspdf';
import { user } from "@nextui-org/theme";

const FilmList = () => {
    const [movies, setMovies] = useState([
        { id: 1, title: "VATROGASNA VJEŽBA", year: 1999, language: "Engleski", duration: "00:01:19" },
        { id: 2, title: "America's most wanted", year: 2001, language: "Engleski", duration: "00:21:10" },
        { id: 3, title: "33. Dani hrvatskog filma", year: 2014, language: "Hrvatski", duration: "00:02:10" },
        { id: 4, title: "Zbirka Emila Laszowskog", year: 1963, language: "Hrvatski", duration: "00:20:15" },
        { id: 5, title: "Otvorenje hotela Vis", year: 1984, language: "Hrvatski", duration: "00:02:10"}
    ]);
    const [selectedMovies, setSelectMovies] = useState([]);
    const [batches, setBatches] = useState([]);
    const [totalSelectedDuration, setTotalSelectedDuration] = useState(0);
    const [warning, setWarning] = useState(false);

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
            setSelectMovies(selectedMovies.filter(m => m.id !== id));
            setTotalSelectedDuration(totalSelectedDuration - movieDuration);
        } else{
            setSelectMovies([...selectedMovies, movie]);
            setTotalSelectedDuration(totalSelectedDuration + movieDuration);
        }

        if (totalSelectedDuration + movieDuration > 45 * 60){
            setWarning(true);
        } else {
            setWarning(false);
        }
    };

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
        setSelectMovies([]);
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Report: archive material digitalization", 20, 20);

        let yPosition = 60;

        doc.setFontSize(12);
        doc.text(`Employee: ${user.name}`, 20, 30);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
        doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 50);
        yPosition = yPosition + 10;

        batches.forEach((batch, batchIndex) => {
            doc.setFontSize(14);
            doc.text(`Batch ${batchIndex + 1}:`, 20, yPosition);
            yPosition = yPosition + 10;

            doc.setFontSize(12);
            batch.forEach((movie, index) => {
                doc.text(`${index + 1}. ${movie.title} (${formatDuration(movie.durationInSeconds)})`, 20, yPosition);
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

        doc.save(`Digitalization_${new Date().toISOString()}.pdf`);
    }

    return (
        <div className="filmlist">
            <Header/>
            <Box sx={{padding: "20px"}}>
                <div>
                    <h2>Film List</h2>
                    <Typography>
                        Total Selected Duration: {formatDuration(totalSelectedDuration)}
                    </Typography>
                    {warning && (
                        <Typography color="error">
                            Warning: Total selected duration exceeds 45 minutes!
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={groupMoviesIntoBatches}
                        style={{marginLeft: '30%'}}
                    >
                        Optimize
                    </Button>
                </div>
                <Table aria-label="film table">
                    <TableHeader>
                        <TableColumn>SELECT</TableColumn>
                        <TableColumn>TITLE</TableColumn>
                        <TableColumn>RELEASE YEAR</TableColumn>
                        <TableColumn>LANGUAGE</TableColumn>
                        <TableColumn>DURATION</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {movies.map(movie => (
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {batches.length > 0 && (
                    <>
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